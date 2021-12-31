import Container from '../components/Container';
import Flex, { FlexChild } from '../components/Flex';
import Heading from '../components/Heading';
import Card from '../components/Card';
import Row, { Cell } from '../components/Row';
import ScrollBox from '../components/ScrollBox';
import Heatmap from '../components/Heatmap';
import React, { useEffect, useState, useRef } from 'react';
import { useHeight, useWidth } from '../hooks/element';
import styled from 'styled-components';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const HeatmapContainer = styled.div`
  padding: 0 0 0 1vh;
  width: ${function (props) {
    return props.width;
  }};
`;

const Computors = function ({ headerHeight }) {
  const containerRef = useRef();
  const containerWidth = useWidth(containerRef);
  const computorListRef = useRef();
  const heatmapRef = useRef();
  const [currentComputor, setCurrentComputor] = useState();
  const currentComputorRef = useRef();
  currentComputorRef.current = currentComputor;
  const computorRatingsHeadingRef = useRef();
  const computorRatingsHeadingHeight = useHeight(computorRatingsHeadingRef);
  const heatmapSize = Math.min(
    window.innerHeight - headerHeight - computorRatingsHeadingHeight - window.innerHeight / 100,
    700
  );
  const rowRef = useRef();
  const rowHeight = useHeight(rowRef);

  const ratings = Array(26 * 26)
    .fill()
    .map(() => Math.random());

  const [computors, setComputors] = useState(
    Array(26 * 26)
      .fill()
      .map((_, i) => ({
        index: i,
        name: ALPHABET[Math.floor(i / 26)] + ALPHABET[i % 26],
        tick: 2,
        epoch: 1,
        normalizedRating:
          (ratings[i] - Math.min.apply(Math, ratings)) /
          (Math.max.apply(Math, ratings) - Math.min.apply(Math, ratings)),
        ratingPercentage: (ratings[i] * 100).toFixed(3),
        rating: ratings[i],
      }))
      .sort((a, b) => b.rating - a.rating)
      .map((computor, i) => ({ ...computor, rank: i + 1 }))
  );

  useEffect(() => {
    const interval = setInterval(function () {
      setComputors(function (computors) {
        const ratingsCopy = ratings.map(function (rating) {
          return Math.max(
            0,
            Math.min(1, rating + (Math.random() > 1 / 2 ? -1 : 1) * Math.random() * 0.01)
          );
        });

        return computors
          .map(function (computor) {
            return {
              ...computor,
              normalizedRating:
                (ratingsCopy[computor.index] - Math.min.apply(Math, ratingsCopy)) /
                (Math.max.apply(Math, ratingsCopy) - Math.min.apply(Math, ratingsCopy)),
              ratingPercentage: (ratingsCopy[computor.index] * 100).toFixed(3),
              rating: ratingsCopy[computor.index],
              prevRating: computor.rating,
            };
          })
          .sort((a, b) => b.rating - a.rating)
          .map((computor, i) => ({ ...computor, rank: i + 1 }));
      });

      if (currentComputorRef.current !== undefined) {
        computorListRef.current.scrollTo(
          0,
          computorListRef.current.querySelector(
            `#computor-${currentComputorRef.current.toString()}`
          ).offsetTop - computorListRef.current.offsetTop
        );
      }
    }, 1000);

    return function () {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [candidates] = useState(
    Array(225)
      .fill()
      .map((_, i) => ({
        index: i,
        rating: (ratings[i] * 100).toFixed(3),
      }))
      .sort((a, b) => b.rating - a.rating)
  );

  useEffect(() => {
    const clickListener = function () {
      setCurrentComputor(undefined);
      computorListRef.current.style.overflowY = 'scroll';
    };

    window.addEventListener('click', clickListener);

    return function () {
      window.removeEventListener('click', clickListener);
    };
  }, []);

  return (
    <Container ref={containerRef}>
      {containerWidth && (
        <>
          <Flex>
            <FlexChild flex={1}>
              <Heading>Computors</Heading>
              <Card fontFamily="'Inconsolata', monospace">
                <Row paddingRight="4px" ref={rowRef}>
                  <Cell flex={0.2}>Rank</Cell>
                  <Cell flex={0.2}>Name</Cell>
                  <Cell flex={0.2}>Rating</Cell>
                  <Cell flex={0.2}>Tick</Cell>
                  <Cell flex={0.2}>Epoch</Cell>
                </Row>
                <ScrollBox ref={computorListRef} height={heatmapSize - rowHeight + 'px'}>
                  {computors.map((computor, i) => (
                    <Row
                      key={i}
                      id={`computor-${computor.index}`}
                      striped
                      current={currentComputor === computor.index}
                      paddingRight={currentComputor === undefined ? 0 : '4px'}
                    >
                      <Cell flex={0.2}>{i + 1}</Cell>
                      <Cell flex={0.2}>{computor.name}</Cell>
                      <Cell flex={0.2}>{computor.ratingPercentage}</Cell>
                      <Cell flex={0.2}>{computor.tick}</Cell>
                      <Cell flex={0.2}>{computor.epoch}</Cell>
                    </Row>
                  ))}
                </ScrollBox>
              </Card>
            </FlexChild>
            <HeatmapContainer width={heatmapSize + 'px'} ref={heatmapRef}>
              <Heading ref={computorRatingsHeadingRef}>Computor ratings</Heading>
              <Heatmap
                size={heatmapSize}
                computors={computors}
                currentComputor={currentComputor}
                setCurrentComputor={setCurrentComputor}
                computorListRef={computorListRef}
              />
            </HeatmapContainer>
          </Flex>
          <Heading>Candidates</Heading>
          <Card
            fontFamily="'Inconsolata', monospace"
            width={
              containerWidth -
              (heatmapRef.current
                ? parseFloat(
                    window.getComputedStyle(heatmapRef.current).getPropertyValue('padding-left')
                  )
                : 0) -
              heatmapSize +
              'px'
            }
          >
            <Row paddingRight="4px">
              <Cell flex={0.4}>Rank</Cell>
              <Cell flex={0.6}>Rating</Cell>
            </Row>
            <ScrollBox height={heatmapSize - rowHeight + 'px'}>
              {candidates.map((candidate, i) => (
                <Row striped key={i} paddingRight={0}>
                  <Cell flex={0.4}>{i + 1}</Cell>
                  <Cell flex={0.6}>{candidate.rating}</Cell>
                </Row>
              ))}
            </ScrollBox>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Computors;
