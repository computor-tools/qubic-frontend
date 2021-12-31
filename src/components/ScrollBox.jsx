import styled from 'styled-components';

const ScrollBox = styled.div`
  overflow-y: scroll;
  height: ${function (props) {
    return props.height;
  }};
`;

export default ScrollBox;
