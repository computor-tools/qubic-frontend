import { useWindowWidth, useWindowHeight } from '../hooks/window';
import Container from '../components/Container';
import Flex from '../components/Flex';
import Heading from '../components/Heading';
import TimeseriesChart from '../components/TimeseriesChart';
import React, { useEffect, useRef, useState } from 'react';
import { useHeight } from '../hooks/element';

const QUs = function ({ headerHeight }) {
  const [numberOfQUs, setNumberOfQUs] = useState([800]);
  const numberOfQUsRef = useRef();
  numberOfQUsRef.current = numberOfQUs;
  const [numberOfBurnedQUs, setNumberOfBurnedQUs] = useState([1]);
  const numberOfBurnedQUsRef = useRef();
  numberOfBurnedQUsRef.current = numberOfBurnedQUs;
  const [issuanceRate, setIssuanceRate] = useState([0]);
  const [burnRate, setBurnRate] = useState([0]);
  const intervalDuration = 100;

  useEffect(function () {
    const interval = setInterval(function () {
      setNumberOfQUs(function (value) {
        return [...value, Math.round(Math.max(0, value[value.length - 1] + Math.random() * 10))];
      });
      setNumberOfBurnedQUs(function (value) {
        return [
          ...value,
          Math.min(
            numberOfQUsRef.current[numberOfQUsRef.current.length - 1],
            Math.round(Math.max(0, value[value.length - 1] + Math.random() * 10))
          ),
        ];
      });
      setIssuanceRate(function (value) {
        return [
          ...value,
          (numberOfQUsRef.current[numberOfQUsRef.current.length - 1] -
            numberOfQUsRef.current[numberOfQUsRef.current.length - 2] || 0) /
            (intervalDuration / 1000),
        ];
      });
      setBurnRate(function (value) {
        return [
          ...value,
          (numberOfBurnedQUsRef.current[numberOfBurnedQUsRef.current.length - 1] -
            numberOfBurnedQUsRef.current[numberOfBurnedQUsRef.current.length - 2] || 0) /
            (intervalDuration / 1000),
        ];
      });
    }, intervalDuration);

    return function () {
      clearInterval(interval);
    };
  }, []);

  const headingRef = useRef();
  const heading2Ref = useRef();
  const chartWidth = useWindowWidth();
  const chartHeight =
    (useWindowHeight() -
      headerHeight -
      useHeight(headingRef) -
      useHeight(heading2Ref) -
      (4 * window.innerHeight) / 100) /
    2;

  return (
    <>
      <Flex>
        <div>
          <Container>
            <Heading ref={headingRef}>
              Issued: {numberOfQUs[numberOfQUs.length - 1]} QU
              <br />
              Burned: {numberOfBurnedQUs[numberOfBurnedQUs.length - 1]} QU
              <br />
              Supply:{' '}
              {numberOfQUs[numberOfQUs.length - 1] -
                numberOfBurnedQUs[numberOfBurnedQUs.length - 1]}{' '}
              QU
            </Heading>
          </Container>
          <TimeseriesChart
            width={chartWidth}
            height={chartHeight}
            data={[numberOfQUs, numberOfBurnedQUs]}
            withCursor={true}
            labels={['Issued', 'Burned', 'Supply']}
          />
        </div>
      </Flex>
      <Flex>
        <div>
          <Container>
            <Heading ref={heading2Ref}>
              Issuance rate: {issuanceRate[issuanceRate.length - 1]} QU/s
              <br />
              Burn rate: {burnRate[burnRate.length - 1]} QU/s
            </Heading>
          </Container>
          <TimeseriesChart
            width={chartWidth}
            height={chartHeight}
            data={[issuanceRate, burnRate]}
            fill={false}
          />
        </div>
      </Flex>
    </>
  );
};

export default QUs;
