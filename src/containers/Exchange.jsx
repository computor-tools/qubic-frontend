import React, { useEffect, useRef, useState } from 'react';
import { useHeight } from '../hooks/element';
import Flex, { FlexChild } from '../components/Flex';
import Container from '../components/Container';
import Card from '../components/Card';
import Row, { Cell } from '../components/Row';
import ScrollBox from '../components/ScrollBox';
import Button from '../components/Button';
import Input from '../components/Input';
import CandlestickChart from '../components/CandlestickChart';
import CloseIcon from '@mui/icons-material/Close';
import styled, { css } from 'styled-components';

const ExchangeContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  padding-top: 1vh;
`;

const StyledSignum = styled.span`
  display: flex;
  align-items: center;
  color: ${function (props) {
    return props.delta > 0 ? '#00ffe9' : '#db3918';
  }};
  font-size: ${function (props) {
    return props.fontSize;
  }};
  font-weight: bold;

  ${function (props) {
    return props.delta > 0
      ? css`
          &::after {
            content: '▲';
            margin-left: 5px;
            font-size: 10px;
          }
        `
      : css`
          &::after {
            content: '▼';
            margin-left: 5px;
            font-size: 10px;
          }
        `;
  }}
`;

const Signum = function ({ signum, delta, children, fontSize }) {
  return (
    <StyledSignum delta={delta} fontSize={fontSize}>
      {signum && delta > 0 && '+'}
      {children}
    </StyledSignum>
  );
};

const Bar = styled.div.attrs(function (props) {
  return {
    style: {
      width: props.width,
    },
  };
})`
  height: 2px;
  background-color: #db3918 !important;
  transition: width 1s;
  margin-top: 5px;
`;

const Track = styled.div.attrs(function (props) {
  return {
    style: {
      opacity: props.opacity,
    },
  };
})`
  height: 2px;
  border-radius: 1px;
  background-color: #00ffe9;
`;

const HighLow = function ({ pair }) {
  return (
    <>
      <Flex fontSize="12px">
        <FlexChild flex={0.5}>{pair.low.toFixed(2)}</FlexChild>
        <FlexChild flex={0.5}>
          <Flex justifyContent="flex-end">{pair.high.toFixed(2)}</Flex>
        </FlexChild>
      </Flex>
      <Bar
        className="Exchange-pair-price-bar"
        width={
          ((Math.max(pair.askPrice, pair.bidPrice) - pair.low) * 100) / (pair.high - pair.low) + '%'
        }
      >
        <Track
          opacity={
            ((Math.max(pair.askPrice, pair.bidPrice) - pair.low) * 100) /
            (pair.high - pair.low) /
            100
          }
        />
      </Bar>
    </>
  );
};

const StyledTrade = styled.div`
  width: 300px;
  background: #222;
  position: relative;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow-y: scroll;
  max-height: ${function (props) {
    return props.maxHeight;
  }};

  .close {
    position: absolute;
    right: 0;
    top: 10px;
    background: transparent;
    border: 0;
    color: #fff;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
    padding: 0 calc(1vw - 4px);
  }

  label {
    display: flex;
    padding: 1vmin calc(10px + 1vw - 4px) 1vmin calc(10px + 1vw);
  }

  input {
    padding: 10px 10px;
    width: calc(100% - 2vw + 4px);
    margin: 0 calc(1vw - 4px) 1vh 1vw;
  }

  .primary-button {
    display: flex;
    width: calc(100% - 2vw + 4px);
    box-sizing: border-box;
    margin: 2vh calc(1vw - 4px) 2vh 1vw;
    padding: 10px 20px;
    border: 0;
    font-weight: bold;
    font-size: 16px;
    border-radius: 30px;
    cursor: pointer;
    justify-content: center;
  }

  p {
    padding: 1vh calc(10px + 1vw - 4px) 1vh calc(10px + 1vw);
    margin: 0;
  }
`;

const Trade = function ({ setAsk, setBid, setCurrentPair, type, pair, maxHeight }) {
  return (
    <StyledTrade maxHeight={maxHeight}>
      <button
        className="close"
        onClick={() => {
          if (type === 'ask') {
            setAsk(undefined);
          } else {
            setBid(undefined);
          }
          setCurrentPair(undefined);
        }}
      >
        <CloseIcon />
      </button>
      <Flex justifyContent="center">
        <h3>{pair.name}</h3>
      </Flex>
      <Flex justifyContent="center">
        <Signum delta={type === 'ask' ? pair.askPriceDelta : pair.bidPriceDelta} fontSize="30px">
          {(type === 'ask' ? pair.askPrice : pair.bidPrice).toFixed(4)}
        </Signum>
      </Flex>
      <label>Amount to {type === 'ask' ? 'ask' : 'bid'}:</label>
      <Input backgroundColor="#444" type="number" value="0.000" />
      <label>Limit:</label>
      <Input
        backgroundColor="#444"
        type="number"
        value={(type === 'ask' ? pair.askPrice : pair.bidPrice).toFixed(2)}
      />
      <p>
        Computor reward: <b>1 QU</b>
      </p>
      <p>
        You receive: <b>0 {type === 'ask' ? 'QU' : pair.name.split('/')[0]}</b>
      </p>
      <Button className="primary-button" backgroundColor={type === 'ask' ? '#db3918' : undefined}>
        {type === 'ask' ? 'Ask' : 'Bid'}
      </Button>
    </StyledTrade>
  );
};

const Exchange = function ({ headerHeight }) {
  const exchangePairsHeaderRef = useRef();
  const exchangePairsHeaderHeight = useHeight(exchangePairsHeaderRef);
  const [marketsData, setMarketsData] = useState(new Map());
  const [ask, setAsk] = useState();
  const [bid, setBid] = useState();
  const [currentPair, setCurrentPair] = useState();
  const names = ['qqq', 'rrr', 'sss', 'ttt', 'uuu', 'vvv', 'www', 'xxx', 'yyy', 'zzz'];
  const [pairs, setPairs] = useState(
    Array(names.length)
      .fill()
      .map((_, i) => {
        const price = Math.random() * 100;
        return {
          name: `${names[i]} / QU`,
          change: Math.random() * 5 * (Math.random() > 1 / 2 ? -1 : 1),
          askPrice: price,
          askPriceDelta: Math.random() > 1 / 2 ? -1 : 1,
          bidPrice: price + Math.random() * 3 * (Math.random() > 1 / 2 ? -1 : 1),
          bidPriceDelta: Math.random() > 1 / 2 ? -1 : 1,
          high: price + Math.random() * 50,
          low: Math.max(0, price - Math.random() * 20),
        };
      })
  );

  useEffect(() => {
    let timeout;
    const interval = function () {
      if (marketsData !== undefined) {
        setPairs((pairs) => {
          if (pairs !== undefined) {
            return pairs.map((pair) => {
              const askPrice = Math.max(
                0,
                pair.askPrice + Math.random() * 1 * (Math.random() > 1 / 2 ? -1 : 1)
              );
              const bidPrice = Math.max(
                0,
                pair.bidPrice + Math.random() * 1 * (Math.random() > 1 / 2 ? -1 : 1)
              );

              setMarketsData((data) => {
                if (data === undefined) {
                  data = new Map();
                  data.set(pair.name, undefined);
                }
                let arr = data.get(pair.name);
                if (arr === undefined) {
                  arr = [];
                  arr.push({
                    high: Math.max(pair.askPrice, pair.bidPrice),
                    low: Math.max(pair.askPrice, pair.bidPrice),
                    open: Math.max(pair.askPrice, pair.bidPrice),
                    close: Math.max(pair.askPrice, pair.bidPrice),
                    timestamp: Date.now(),
                  });
                }

                if (Date.now() - arr[arr.length - 1].timestamp >= 10000) {
                  arr.push({
                    high: Math.max(pair.askPrice, pair.bidPrice),
                    low: Math.max(pair.askPrice, pair.bidPrice),
                    open: Math.max(pair.askPrice, pair.bidPrice),
                    close: Math.max(pair.askPrice, pair.bidPrice),
                    timestamp: Date.now(),
                  });
                }

                arr[arr.length - 1] = {
                  high:
                    arr[arr.length - 1].high < Math.max(pair.askPrice, pair.bidPrice)
                      ? Math.max(pair.askPrice, pair.bidPrice)
                      : arr[arr.length - 1].high,
                  low:
                    arr[arr.length - 1].low > Math.max(pair.askPrice, pair.bidPrice)
                      ? Math.max(pair.askPrice, pair.bidPrice)
                      : arr[arr.length - 1].low,
                  open:
                    arr[arr.length - 1].open === undefined
                      ? Math.max(pair.askPrice, pair.bidPrice)
                      : arr[arr.length - 1].open,
                  close: Math.max(pair.askPrice, pair.bidPrice),
                  timestamp: arr[arr.length - 1].timestamp,
                };

                data.set(pair.name, arr);
                return new Map(data);
              });

              return {
                ...pair,
                change:
                  ((Math.max(askPrice, bidPrice) - Math.max(pair.askPrice, pair.bidPrice)) * 100) /
                  Math.max(askPrice, bidPrice),
                askPrice,
                askPriceDelta: pair.askPrice > askPrice ? -1 : 1,
                bidPrice,
                bidPriceDelta: pair.bidPrice > bidPrice ? -1 : 1,
                low:
                  pair.low > Math.min(askPrice, bidPrice) ? Math.min(askPrice, bidPrice) : pair.low,
                high:
                  pair.high < Math.max(askPrice, bidPrice)
                    ? Math.max(askPrice, bidPrice)
                    : pair.high,
              };
            });
          }
          return pairs;
        });
        timeout = setTimeout(interval, 1000);
      }
    };

    interval();

    return function () {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ExchangeContainer>
      <Card fontFamily="'Inconsolata', monospace">
        <Flex>
          <FlexChild>
            <Row ref={exchangePairsHeaderRef}>
              <Cell flex={0.1}>Market</Cell>
              <Cell flex={0.1} justifyContent="center">
                Change
              </Cell>
              <Cell flex={0.3} justifyContent="center">
                Ask
              </Cell>
              <Cell flex={0.3} justifyContent="center">
                Bid
              </Cell>
              <Cell flex={0.1}>Low</Cell>
              <Cell flex={0.1} justifyContent="flex-end">
                High
              </Cell>
            </Row>
            <ScrollBox
              height={
                (window.innerHeight - headerHeight - (3 * window.innerHeight) / 100) / 2 -
                exchangePairsHeaderHeight +
                'px'
              }
            >
              {pairs.map((pair, i) => (
                <Row
                  current={i === currentPair}
                  striped
                  key={pair.name}
                  onClick={function () {
                    setCurrentPair(i);
                  }}
                  paddingX="10px"
                >
                  <Cell flex={0.1}>{pair.name}</Cell>
                  <Cell flex={0.1} justifyContent="center">
                    <Signum delta={pair.change} signum>
                      {pair.change.toFixed(2)}
                    </Signum>
                  </Cell>
                  <Cell flex={0.3} justifyContent="center" alignItems="center">
                    <FlexChild
                      flex={0.5}
                      display="flex"
                      justifyContent="flex-end"
                      padding="0 10px 0 0"
                    >
                      <Signum delta={pair.askPriceDelta}>{pair.askPrice.toFixed(2)}</Signum>
                    </FlexChild>
                    <FlexChild flex={0.5} display="flex" padding="0 0 0 10px">
                      <Button
                        backgroundColor="#db3918"
                        fontSize="14px"
                        paddingX="4px"
                        marginTop="0"
                        onClick={() => {
                          setBid(undefined);
                          setAsk(i);
                          setCurrentPair(i);
                        }}
                      >
                        Ask
                      </Button>
                    </FlexChild>
                  </Cell>
                  <Cell flex={0.3} justifyContent="center">
                    <FlexChild
                      flex={0.5}
                      display="flex"
                      justifyContent="flex-end"
                      padding="0 10px 0 0"
                    >
                      <Signum delta={pair.bidPriceDelta}>{pair.bidPrice.toFixed(2)}</Signum>
                    </FlexChild>
                    <FlexChild flex={0.5} display="flex" padding="0 0 0 10px">
                      <Button
                        fontSize="14px"
                        paddingX="4px"
                        marginTop="0"
                        onClick={() => {
                          setAsk(undefined);
                          setBid(i);
                          setCurrentPair(i);
                        }}
                      >
                        Bid
                      </Button>
                    </FlexChild>
                  </Cell>
                  <Cell flex={0.2} flexDirection="column">
                    <HighLow pair={pair} />
                  </Cell>
                </Row>
              ))}
            </ScrollBox>
          </FlexChild>
          {ask !== undefined && (
            <Trade
              maxHeight={
                (window.innerHeight - headerHeight - (3 * window.innerHeight) / 100) / 2 + 'px'
              }
              type="ask"
              pair={pairs[ask]}
              setAsk={setAsk}
              setCurrentPair={setCurrentPair}
            />
          )}
          {bid !== undefined && (
            <Trade
              maxHeight={
                (window.innerHeight - headerHeight - (3 * window.innerHeight) / 100) / 2 + 'px'
              }
              type="bid"
              pair={pairs[bid]}
              setBid={setBid}
              setCurrentPair={setCurrentPair}
            />
          )}
        </Flex>
      </Card>
      <CandlestickChart
        data={marketsData}
        height={(window.innerHeight - headerHeight - (3 * window.innerHeight) / 100) / 2}
        currentPair={currentPair ? pairs[currentPair] : pairs[0]}
      />
    </ExchangeContainer>
  );
};

export default Exchange;
