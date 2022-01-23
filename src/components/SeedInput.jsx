import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { seedChecksum, SEED_IN_LOWERCASE_LATIN_LENGTH } from 'qubic-js';
import Input from './Input';
import { useHeight } from '../hooks/element';

const Container = styled.div`
  position: relative;
`;

const Checksum = styled.div`
  position: absolute;
  top: ${function (props) {
    return (props.inputHeight - props.checksumHeight) / 2;
  }}px;
  right: -55px;
  font-family: Inconsolata, monospace;
  font-size: 30px;
`;

const SeedInput = forwardRef(function SeedInput2({ type, value, onChange }, ref) {
  const [checksum, setChecksum] = useState('');
  const checksumRef = useRef();
  const checksumHeight = useHeight(checksumRef);
  const inputHeight = useHeight(ref);

  useEffect(
    function () {
      if (value.length === SEED_IN_LOWERCASE_LATIN_LENGTH) {
        seedChecksum(value).then(function (checksum2) {
          setChecksum(checksum2);
        });
      } else {
        setChecksum('');
      }
    },
    [value]
  );

  return (
    <>
      <Container>
        <Input
          ref={ref}
          type={type}
          size={SEED_IN_LOWERCASE_LATIN_LENGTH}
          maxLength={SEED_IN_LOWERCASE_LATIN_LENGTH}
          autoFocus={true}
          fontSize="30px"
          spellCheck="false"
          value={value}
          onChange={onChange}
        />
        <Checksum inputHeight={inputHeight} checksumHeight={checksumHeight} ref={checksumRef}>
          {checksum}
        </Checksum>
      </Container>
    </>
  );
});

export default SeedInput;
