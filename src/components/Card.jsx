import styled from 'styled-components';

const Card = styled.div`
  border-radius: 10px;
  background: #000;
  font-family: ${function (props) {
    return props.fontFamily;
  }};
  width: ${function (props) {
    return props.width || 'auto';
  }};
`;

export default Card;
