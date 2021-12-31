import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  justify-content: ${function (props) {
    return props.justifyContent;
  }};
  font-size: ${function (props) {
    return props.fontSize;
  }};
`;

export const FlexChild = styled.div`
  display: ${function (props) {
    return props.display || 'block';
  }};
  flex: ${function (props) {
    return props.flex || 1;
  }};
  justify-content: ${function (props) {
    return props.justifyContent;
  }};
  padding: ${function (props) {
    return props.padding;
  }};
`;

export default Flex;
