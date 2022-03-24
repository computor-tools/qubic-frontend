import React, { useContext, useCallback, useEffect, useRef, useState } from 'react';
import Container from '../components/Container';
import { InputField } from '../components/Input';
import { AuthContext } from '../components/AuthProvider';
import Row, { Cell } from '../components/Row';
import RequireAuth from '../components/RequireAuth';
import Flex, { FlexChild } from '../components/Flex';
import Button from '../components/Button';
import { validateIpAddress } from '../utils/validateIpAddress';
import useInputField from '../hooks/useInput';

const Computor = function () {
  const { computorIpForRemoteControl, setComputorIpForRemoteControl, computor } =
    useContext(AuthContext);
  const nodeInfoRef = useRef();
  const [nodeInfo, setNodeInfo] = useState(undefined);
  const [nodeInfoInterval, setNodeInfoInterval] = useState();

  const input = useInputField(computorIpForRemoteControl, {
    validate: validateIpAddress,
    placeholder: 'Computor IP',
    name: 'computorInput',
  });

  const handleComputor = useCallback(() => {
    const { value } = input;
    if (computor !== undefined && value !== computorIpForRemoteControl) {
      clearInterval(nodeInfoInterval);
      setNodeInfo(undefined);
      computor.close();
    }
    if (input.validate() === true) {
      setComputorIpForRemoteControl(value);
      input.initialize();
    }
  }, [
    computor,
    computorIpForRemoteControl,
    input,
    nodeInfoInterval,
    setComputorIpForRemoteControl,
  ]);

  useEffect(
    function () {
      const getNodeInfo = function () {
        const f = function () {
          computor.getNodeInfo().then(function (i) {
            i.numberOfProcessedRequestsDelta =
              i.numberOfProcessedRequests - (nodeInfoRef.current?.numberOfProcessedRequests || 0n);
            i.numberOfReceivedBytesDelta =
              i.numberOfReceivedBytes - (nodeInfoRef.current?.numberOfReceivedBytes || 0n);
            i.numberOfTransmittedBytesDelta =
              i.numberOfTransmittedBytes - (nodeInfoRef.current?.numberOfTransmittedBytes || 0n);
            setNodeInfo(i);
            nodeInfoRef.current = i;
          });
        };
        f();
        setNodeInfoInterval(setInterval(f, 1000));
      };

      let interval;
      if (computor !== undefined && nodeInfo === undefined) {
        interval = getNodeInfo();
      }

      return function () {
        clearInterval(interval);
      };
    },
    [computor, nodeInfo]
  );

  useEffect(
    function () {
      return function () {
        clearInterval(nodeInfoInterval);
      };
    },
    [nodeInfoInterval]
  );

  return (
    <RequireAuth>
      <Container>
        <Flex
          alignItems="baseline"
          justifyContent="space-between"
          fontFamily="monospace"
          fontSize="18px"
        >
          <InputField {...input} errorRight>
            <Button onClick={handleComputor} disabled={input.pristine}>
              Save
            </Button>
          </InputField>
          {nodeInfo !== undefined && <FlexChild padding="0 1vw">{nodeInfo.ownPublicKey}</FlexChild>}
          {nodeInfo !== undefined && (
            <Button
              fontSize="14px"
              onClick={function () {
                computor.shutdown();
              }}
            >
              Shutdown
            </Button>
          )}
        </Flex>
        {nodeInfo !== undefined && (
          <Flex fontFamily="monospace">
            <FlexChild>
              <Row>
                <Cell>Role:</Cell>
                <Cell>{nodeInfo.role}</Cell>
              </Row>
              <Row>
                <Cell>Number of processors:</Cell>
                <Cell>{nodeInfo.numberOfProcessors}</Cell>
              </Row>
              <Row>
                <Cell>Number of busy processors:</Cell>
                <Cell>{nodeInfo.numberOfBusyProcessors}</Cell>
              </Row>
              <Row>
                <Cell>CPU load:</Cell>
                <Cell>{nodeInfo.cpuLoad}%</Cell>
              </Row>
            </FlexChild>
            <FlexChild>
              <Row>
                <Cell>Number of processed requests:</Cell>
                <Cell>
                  {'(+'}
                  {nodeInfo.numberOfProcessedRequestsDelta.toString()}
                  {') '}
                  {nodeInfo.numberOfProcessedRequests.toString()}
                </Cell>
              </Row>
              <Row>
                <Cell>Number of received bytes:</Cell>
                <Cell>
                  {'(+'}
                  {nodeInfo.numberOfReceivedBytesDelta.toString()}
                  {') '}
                  {nodeInfo.numberOfReceivedBytes.toString()}
                </Cell>
              </Row>
              <Row>
                <Cell>Number of transmitted bytes:</Cell>
                <Cell>
                  {'(+'}
                  {nodeInfo.numberOfTransmittedBytesDelta.toString()}
                  {') '}
                  {nodeInfo.numberOfTransmittedBytes.toString()}
                </Cell>
              </Row>
              <Row>
                <Cell>Number of peers:</Cell>
                <Cell>{nodeInfo.numberOfPeers}</Cell>
              </Row>
            </FlexChild>
          </Flex>
        )}
      </Container>
    </RequireAuth>
  );
};

export default Computor;
