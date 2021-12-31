import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const N = ALPHABET.length + 1;

const Container = styled.div`
  position: relative;
  min-width: ${function (props) {
    return props.size;
  }};
  min-height: ${function (props) {
    return props.size;
  }};
`;

const Label = styled.div`
  box-sizing: border-box;
  display: flex;
  font-family: 'Inconsolata', monospace;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  float: left;
  width: ${function (props) {
    return props.size;
  }};
  height: ${function (props) {
    return props.size;
  }};

  ${function (props) {
    return (
      props.highlighted &&
      css`
        color: #00ffe9;
      `
    );
  }}
`;

const Tooltip = styled.div`
  width: 80px;
  position: absolute;
  background: #00ffe9;
  color: #000;
  box-sizing: border-box;
  padding: 5px 0;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  display: none;
  top: ${function (props) {
    return props.top;
  }};
`;

const TooltipLabel = styled.span`
  font-size: 12px;
  font-weight: normal;
`;

const Square = styled.div.attrs(function (props) {
  return {
    style: {
      backgroundColor: `rgba(0, 117, 107, ${props.alpha})`,
    },
  };
})`
  box-sizing: border-box;
  border: 2px solid #121212;
  border-radius: 4px;
  float: left;
  width: ${function (props) {
    return props.size;
  }};
  height: ${function (props) {
    return props.size;
  }};
  cursor: pointer;

  &:hover {
    border-color: #00ffe9;
  }

  ${function (props) {
    return (
      props.current &&
      css`
        border-color: #00ffe9;
      `
    );
  }}
`;

const Heatmap = function ({
  size,
  computors,
  currentComputor,
  setCurrentComputor,
  computorListRef,
}) {
  const [hoverComputor, setHoverComputor] = useState();
  const [tooltip, setTooltip] = useState();
  const [currentLabelY, setCurrentLabelY] = useState();
  const [currentLabelX, setCurrentLabelX] = useState();
  const tooltipRef = useRef();
  const squareRef = useRef();

  const computorsCopy = [...computors].sort((a, b) => a.index - b.index);
  const heatmap = [];

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i === 0 && j === 0) {
        heatmap.push('');
      } else if (i === 0) {
        heatmap.push(ALPHABET.charAt(j - 1));
      } else if (j === 0) {
        heatmap.push(ALPHABET.charAt(i - 1));
      } else {
        heatmap.push(computorsCopy[(i - 1) * ALPHABET.length + j - 1]);
      }
    }
  }

  useEffect(
    function () {
      setTooltip(function (value) {
        if (value === undefined) {
          return undefined;
        }
        return {
          ...value,
          ...computorsCopy[hoverComputor],
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [computors]
  );

  useEffect(
    function () {
      if (tooltipRef.current) {
        tooltipRef.current.style.left =
          tooltip.left -
          parseFloat(window.getComputedStyle(tooltipRef.current).getPropertyValue('width')) / 2 +
          size / N / 2 +
          'px';
        tooltipRef.current.style.display = 'block';
      }
    },
    [tooltip, size]
  );

  return (
    <Container size={size + 'px'}>
      {tooltip && (
        <Tooltip
          ref={tooltipRef}
          top={
            tooltip.top +
            size / N +
            parseFloat(
              window.getComputedStyle(squareRef.current).getPropertyValue('border-bottom-width')
            ) *
              2 +
            'px'
          }
        >
          <TooltipLabel>
            #{tooltip.rank} {tooltip.name} <br />
            {tooltip.ratingPercentage}%
          </TooltipLabel>
        </Tooltip>
      )}
      {heatmap.map((square, i) =>
        typeof square === 'string' ? (
          <Label
            key={i}
            size={size / N + 'px'}
            highlighted={
              (i < N && currentLabelX === square) || (i >= N && currentLabelY === square)
            }
          >
            {square}
          </Label>
        ) : (
          <Square
            key={i}
            ref={i === N + 1 ? squareRef : undefined}
            current={currentComputor === square.index}
            size={size / N + 'px'}
            alpha={square.normalizedRating}
            onClick={(event) => {
              event.stopPropagation();
              if (currentComputor === square.index) {
                setCurrentComputor(undefined);
                return;
              }
              computorListRef.current.style.overflowY = 'hidden';
              computorListRef.current.scrollTo(
                0,
                computorListRef.current.querySelector(`#computor-${square.index.toString()}`)
                  .offsetTop - computorListRef.current.offsetTop
              );
              setCurrentComputor(square.index);
            }}
            onMouseEnter={function (event) {
              setTooltip({
                ...square,
                top: event.target.offsetTop,
                left: event.target.offsetLeft,
              });
              setHoverComputor(square.index);
              setCurrentLabelY(square.name[0]);
              setCurrentLabelX(square.name[1]);
            }}
            onMouseLeave={function () {
              setTooltip(undefined);
              setHoverComputor(undefined);
              setCurrentLabelY(undefined);
              setCurrentLabelX(undefined);
            }}
          />
        )
      )}
    </Container>
  );
};

export default Heatmap;
