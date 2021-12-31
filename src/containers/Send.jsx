import React from 'react';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { PUBLIC_KEY_LENGTH } from 'qubic-js';

const Send = function () {
  return (
    <div className="Send">
      <div className="Send-form">
        <label>Recepient identity:</label>
        <div
          contentEditable={true}
          className="Send-identity"
          onPaste={function (event) {
            event.preventDefault();
            const text = (event.originalEvent || event).clipboardData.getData('text/plain');
            if (text.length === 70) {
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
        <div className="Send-balance-and-button">
          <div>
            <input type="number" className="Send-balance" />
            <span className="Send-balance-currency">QUs</span>
          </div>
          <button>
            <CallMadeIcon />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Send;
