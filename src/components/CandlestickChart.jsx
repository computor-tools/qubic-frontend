import React, { useEffect, useRef, useState } from 'react';
import { useHeight } from '../hooks/element';
import { useWindowWidth } from '../hooks/window';

const useCursor = function (svg, extremaRef, xAxisTooltipText, cursorXAxisTooltipText) {
  const [cursor, setCursor] = useState();

  useEffect(
    function () {
      if (svg !== undefined) {
        const mouseEnterListener = function () {
          setCursor(function (value) {
            return {
              ...value,
              visibility: 'visible',
            };
          });
        };

        const mouseLeaveListener = function () {
          setCursor(function (value) {
            return {
              ...value,
              visibility: 'hidden',
            };
          });
        };

        const mouseMoveListener = function (event) {
          const svgRect = svg.getBoundingClientRect();
          const textRect = xAxisTooltipText.getBoundingClientRect();
          const cursorTextRect = cursorXAxisTooltipText.getBoundingClientRect();
          if (
            event.pageY - svgRect.top >= textRect.height &&
            event.pageX - svgRect.left <= svgRect.width - (textRect.width + 5)
          ) {
            let max = extremaRef.current.max;
            let min = extremaRef.current.min;
            setCursor({
              visibility: 'visible',
              pageY: event.pageY,
              xAxisTooltip: {
                text: (
                  ((svgRect.height -
                    textRect.height -
                    (event.pageY - svgRect.top - textRect.height)) /
                    (svgRect.height - textRect.height)) *
                    (max - min) +
                  min
                ).toFixed(2),
                x: svgRect.width - cursorTextRect.width,
                y: event.pageY - svgRect.top,
                axis: {
                  y: event.pageY - svgRect.top,
                  width: svgRect.width - cursorTextRect.width - 5,
                },
              },
              yAxisTooltip: {
                axis: {
                  x: event.pageX - svgRect.left,
                  y: textRect.height,
                  height: svgRect.height - textRect.height,
                },
              },
            });
          } else {
            setCursor(function (value) {
              return {
                ...value,
                visibility: 'hidden',
              };
            });
          }
        };

        svg.addEventListener('mouseenter', mouseEnterListener);
        svg.addEventListener('mouseleave', mouseLeaveListener);
        svg.addEventListener('mousemove', mouseMoveListener);

        return function () {
          svg.removeEventListener('mouseenter', mouseEnterListener);
          svg.removeEventListener('mouseleave', mouseLeaveListener);
          svg.removeEventListener('mousemove', mouseMoveListener);
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [svg]
  );

  return [cursor, setCursor];
};

const useControls = function (
  svg,
  N,
  minNumberOfCandles,
  minCandleWidth,
  scalingFactor,
  translatingFactor,
  lengthRef
) {
  const [n, setN] = useState(N);
  const nRef = useRef();
  nRef.current = n;
  const [x, setX] = useState(0);

  useEffect(
    function () {
      if (svg !== undefined) {
        let mouseEntered = false;

        const wheelListener = function (event) {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            setN(function (v) {
              return Math.max(
                Math.min(
                  Math[event.deltaY > 0 ? 'ceil' : 'floor'](
                    v + (event.deltaY * scalingFactor * nRef.current) / N
                  ),
                  svg.getBoundingClientRect().width / minCandleWidth
                ),
                minNumberOfCandles
              );
            });
          } else {
            setX(function (v) {
              return Math.min(
                Math.max(
                  Math[event.deltaX > 0 ? 'ceil' : 'floor'](
                    v + (event.deltaX * translatingFactor * nRef.current) / N
                  ),
                  nRef.current - lengthRef.current
                ),
                0
              );
            });
          }
        };

        const mouseEnterListener = function () {
          mouseEntered = true;
        };

        const mouseLeaveListener = function () {
          mouseEntered = false;
        };

        const windowWheelListener = function (event) {
          if (mouseEntered === true) {
            event.preventDefault();
          }
        };

        svg.addEventListener('wheel', wheelListener);
        svg.addEventListener('mouseenter', mouseEnterListener);
        svg.addEventListener('mouseleave', mouseLeaveListener);
        window.addEventListener('wheel', windowWheelListener, {
          passive: false,
        });

        return function () {
          svg.removeEventListener('wheel', wheelListener);
          svg.removeEventListener('mouseenter', mouseEnterListener);
          svg.removeEventListener('mouseleave', mouseLeaveListener);
          window.removeEventListener('wheel', windowWheelListener);
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [svg]
  );

  return [n, x];
};

const extrema = function (data) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (let j = 0; j < data.length; j++) {
    min = Math.min(min, data[j].low);
    max = Math.max(max, data[j].high);
  }

  return { min, max };
};

const useChart = function (svg, xAxisTooltipText, cursorXAxisTooltipText, dataMap, currentPair) {
  const entireData = dataMap?.get(currentPair.name);
  const lengthRef = useRef();
  lengthRef.current = entireData?.length;
  const lastFrame = entireData && entireData[entireData.length - 1];
  const [numberOfCandles, offset] = useControls(svg, 300, 10, 0.1, 1.5, 0.5, lengthRef);
  const data = entireData?.slice(0, offset < 0 ? offset : undefined).slice(-numberOfCandles);
  const [candles, setCandles] = useState([]);
  const [xAxisTooltip, setXAxisTooltip] = useState();
  const extremaRef = useRef();
  const [cursor, setCursor] = useCursor(svg, extremaRef, xAxisTooltipText, cursorXAxisTooltipText);

  useEffect(
    function () {
      if (svg !== undefined && data !== undefined) {
        const { min, max } = extrema(data);
        extremaRef.current = { min, max };

        const svgRect = svg.getBoundingClientRect();
        const textRect = xAxisTooltipText.getBoundingClientRect();
        const cursorTextRect = cursorXAxisTooltipText.getBoundingClientRect();

        setCursor(function (value) {
          if (value === undefined || value.visibility === 'hidden') {
            return value;
          }
          return {
            ...value,
            xAxisTooltip: {
              ...value.xAxisTooltip,
              text: (
                ((svgRect.height -
                  textRect.height -
                  (value.pageY - svgRect.top - textRect.height)) /
                  (svgRect.height - textRect.height)) *
                  (max - min) +
                min
              ).toFixed(2),
              x: svgRect.width - cursorTextRect.width,
              axis: {
                ...value.xAxisTooltip.axis,
                width: svgRect.width - cursorTextRect.width - 5,
              },
            },
          };
        });

        setXAxisTooltip({
          fill:
            lastFrame.open >= lastFrame.close
              ? lastFrame.open === lastFrame.close
                ? '#777'
                : '#db3918'
              : '#00ffe9',
          text: lastFrame.close.toFixed(2),
        });

        const height = svgRect.height - textRect.height;
        const width = svgRect.width - textRect.width - 5;

        setXAxisTooltip(function (value) {
          return {
            ...value,
            x: svgRect.width - textRect.width,
            y: height * (1 - (lastFrame.close - min) / (max - min)) + textRect.height,
          };
        });

        setCandles(
          data.map(function (frame, i) {
            const h1 = (frame.open - min) / (max - min);
            const h2 = (frame.close - min) / (max - min);
            const h3 = (frame.high - min) / (max - min);
            const h4 = (frame.low - min) / (max - min);
            return {
              realBody: {
                x: i * (width / numberOfCandles),
                y: height * (1 - (h1 > h2 ? h1 : h2)) + textRect.height,
                width: (width / numberOfCandles) * 0.9,
                height: height * (h1 > h2 ? h1 - h2 : h2 - h1),
                rx: width / numberOfCandles / 4,
                fill: frame.open > frame.close ? '#db3918' : '#00ffe9',
              },
              wick: {
                x: i * (width / numberOfCandles) + ((width / numberOfCandles) * 0.9) / 2,
                y: height * (1 - h3) + textRect.height,
                width: Math.min(1, width / numberOfCandles / 10),
                height: height * (h3 - h4),
                fill: frame.open > frame.close ? '#db3918' : '#00ffe9',
              },
            };
          })
        );

        setXAxisTooltip(function (value) {
          return {
            ...value,
            axis: {
              stroke:
                lastFrame.open >= lastFrame.close
                  ? lastFrame.open === lastFrame.close
                    ? '#777'
                    : '#db3918'
                  : '#00ffe9',
              y: height * (1 - (lastFrame.close - min) / (max - min)) + textRect.height,
              width,
            },
          };
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [svg, numberOfCandles, offset, dataMap]
  );

  return { candles, xAxisTooltip, cursor };
};

const CandlestickChart = function ({ data, height, currentPair }) {
  const windowWidth = useWindowWidth();
  const headingRef = useRef();
  const headingHeight = useHeight(headingRef);
  const svgRef = useRef();
  const xAxisTooltipTextRef = useRef();
  const cursorXAxisTooltipTextRef = useRef();

  const { candles, xAxisTooltip, cursor } = useChart(
    svgRef.current,
    xAxisTooltipTextRef.current,
    cursorXAxisTooltipTextRef.current,
    data,
    currentPair
  );

  return (
    <div className="Exchange-chart" style={{ height }}>
      <h3 className="Exchange-chart-heading" ref={headingRef}>
        {currentPair.name}
      </h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={windowWidth - (8 * windowWidth) / 100}
        height={height - headingHeight}
        viewBox={`0 0 ${windowWidth - (8 * windowWidth) / 100} ${height - headingHeight}`}
        ref={svgRef}
      >
        <text
          xmlns="http://www.w3.org/2000/svg"
          x={xAxisTooltip?.x}
          y={xAxisTooltip?.y}
          fill={xAxisTooltip?.fill}
          fontWeight="bold"
          fontSize="16"
          fontFamily="Inconsolata"
          ref={xAxisTooltipTextRef}
        >
          {xAxisTooltip?.text}
        </text>
        {xAxisTooltip?.axis && (
          <g
            xmlns="'http://www.w3.org/2000/svg'"
            fill="none"
            stroke={xAxisTooltip.axis.stroke}
            strokeWidth="1"
          >
            <path
              xmlns="'http://www.w3.org/2000/svg'"
              strokeDasharray="1,1"
              d={`M0 ${xAxisTooltip.axis.y} l${xAxisTooltip.axis.width} 0`}
            />
          </g>
        )}
        <text
          xmlns="http://www.w3.org/2000/svg"
          x={cursor?.xAxisTooltip?.x}
          y={cursor?.xAxisTooltip?.y}
          fill="#fff"
          fontWeight="bold"
          fontSize="16"
          fontFamily="Inconsolata"
          visibility={cursor?.visibility}
          ref={cursorXAxisTooltipTextRef}
        >
          {cursor?.xAxisTooltip?.text}
        </text>
        {cursor?.xAxisTooltip?.axis && (
          <g
            xmlns="'http://www.w3.org/2000/svg'"
            fill="none"
            stroke="#444"
            strokeWidth="2"
            visibility={cursor.visibility}
          >
            <path
              xmlns="'http://www.w3.org/2000/svg'"
              strokeDasharray="2,4"
              d={`M0 ${cursor.xAxisTooltip.axis.y} l${cursor.xAxisTooltip.axis.width} 0`}
            />
          </g>
        )}
        {cursor?.yAxisTooltip?.axis && (
          <g
            xmlns="'http://www.w3.org/2000/svg'"
            fill="none"
            stroke="#444"
            strokeWidth="2"
            visibility={cursor.visibility}
          >
            <path
              xmlns="'http://www.w3.org/2000/svg'"
              strokeDasharray="2,4"
              d={`M${cursor.yAxisTooltip.axis.x} ${cursor.yAxisTooltip.axis.y} l0 ${cursor.yAxisTooltip.axis.height}`}
            />
          </g>
        )}
        {candles.map(function ({ realBody, wick }, i) {
          return (
            <g xmlns="http://www.w3.org/2000/svg" key={i}>
              <rect
                xmlns="http://www.w3.org/2000/svg"
                x={realBody.x}
                y={realBody.y}
                width={realBody.width}
                height={realBody.height}
                rx={realBody.rx}
                fill={realBody.fill}
              />
              <rect
                xmlns="http://www.w3.org/2000/svg"
                x={wick.x}
                y={wick.y}
                width={wick.width}
                height={wick.height}
                fill={wick.fill}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickChart;
