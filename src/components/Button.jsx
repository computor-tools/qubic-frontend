import styled from 'styled-components';

const Button = styled.button`
  width: ${function (props) {
    return props.width || 'auto';
  }};
  background-color: ${function (props) {
    return props.backgroundColor || '#00ffe9';
  }};
  font-size: ${function (props) {
    return props.fontSize || '20px';
  }};
  font-weight: bold;
  padding: 1vh 2vw;
  padding-bottom: ${function (props) {
    return props.paddingX;
  }};
  padding-top: ${function (props) {
    return props.paddingX;
  }};
  border: 0;
  border-radius: 30px;
  margin-top: ${function (props) {
    return props.marginTop || 0;
  }};
  cursor: pointer;
`;

export default Button;
