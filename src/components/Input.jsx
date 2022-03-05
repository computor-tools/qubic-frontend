import styled from 'styled-components';

const Input = styled.input`
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

export default Input;
