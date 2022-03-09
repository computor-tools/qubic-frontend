import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../components/AuthProvider';
import Button from '../components/Button';

const Textarea = styled.textarea`
  padding: 1vh 1vw;
  margin: 0 0 1vh 0;
  margin-left: ${function (props) {
    return props.marginLeft;
  }};
  width: ${function (props) {
    return props.width;
  }};
  box-sizing: border-box;
  background-color: ${function (props) {
    return props.backgroundColor || '#333';
  }};
  border-radius: 30px;
  border: 1px solid transparent;
  color: #fff;
  font-size: ${function (props) {
    return props.fontSize || '20px';
  }};
  font-family: Inconsolata, monospace;
  transition: border 0.4s;

  &:focus {
    border-color: #00ffe9;
  }
`;

const Import = function () {
  const [receipt, setReceipt] = useState(undefined);
  const { client } = useContext(AuthContext);
  return (
    <div>
      <Textarea
        placeholder="Receipt"
        onChange={function (event) {
          setReceipt(event.target.value);
        }}
      ></Textarea>
      <Button
        onClick={function () {
          client.importReceipt(receipt);
        }}
      >
        Import receipt
      </Button>
    </div>
  );
};

export default Import;
