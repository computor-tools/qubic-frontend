import React, { useContext, useState } from 'react';
import { ConnectionContext } from '../components/ConnectionProvider';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
import styled from 'styled-components';
import Heading from '../components/Heading';

const ComputorSettings = styled.div`
  width: 300px;
`;

const Settings = function () {
  const connection = useContext(ConnectionContext);
  const computors = connection.computors();
  const [computor0, setComputor0] = useState(computors[0]);
  const [computor1, setComputor1] = useState(computors[1]);
  const [computor2, setComputor2] = useState(computors[2]);

  return (
    <Container>
      <ComputorSettings>
        <Heading>Computors</Heading>
        <Input
          value={computor0}
          onChange={function (event) {
            setComputor0(event.target.value);
          }}
        />
        <Input
          value={computor1}
          onChange={function (event) {
            setComputor1(event.target.value);
          }}
        />
        <Input
          value={computor2}
          onChange={function (event) {
            setComputor2(event.target.value);
          }}
        />
        <Button
          onClick={function () {
            connection.setComputorUrl(0, computor0);
            connection.setComputorUrl(1, computor1);
            connection.setComputorUrl(2, computor2);
          }}
        >
          Save
        </Button>
      </ComputorSettings>
    </Container>
  );
};

export default Settings;
