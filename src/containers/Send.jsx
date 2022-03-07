import React, { useContext, useState } from 'react';
import { PUBLIC_KEY_LENGTH } from 'qubic-js';
import { AuthContext } from '../components/AuthProvider';
import Button from '../components/Button';
import styled from 'styled-components';
import { Navigate } from 'react-router';

const Error = styled.div`
  color: #db3918;
  padding: 1vh 1vw 2vh 1vw;
`;

const Send = function () {
  const { client } = useContext(AuthContext);
  const [destination, setDestination] = useState('');
  const [energy, setEnergy] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  return sent ? (
    <Navigate to="/wallet" state={{ from: location }} />
  ) : (
    <div className="Send">
      <div className="Send-form">
        {error && <Error>{error}</Error>}
        <label>Recepient identity:</label>
        <div
          contentEditable={true}
          className="Send-identity"
          onPaste={function (event) {
            event.preventDefault();
            const text = (event.originalEvent || event).clipboardData.getData('text/plain');
            if (text.length === 70) {
              setDestination(text);
              document.execCommand(
                'insertHTML',
                false,
                `${text.slice(
                  0,
                  PUBLIC_KEY_LENGTH * 2
                )}<span class="Receive-new-identity-text-checksum">${text.slice(
                  PUBLIC_KEY_LENGTH * 2
                )}</span>`
              );
            }
          }}
        ></div>
        <label>Amount:</label>
        <div className="Send-energy-and-button">
          <div>
            <input
              type="number"
              value={energy}
              className="Send-energy"
              onChange={function (event) {
                setEnergy(event.target.value);
              }}
            />
            <span className="Send-energy-currency">QUs</span>
          </div>
        </div>
        <Button
          marginTop="1vh"
          type="submit"
          onClick={async function () {
            try {
              await client.transfer({
                destination,
                energy: BigInt(energy),
              });
              setSent(true);
            } catch (error) {
              setError(error.message);
            }
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Send;
