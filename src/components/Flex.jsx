import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  align-items: ${function (props) {
    return props.alignItems;
  }};
  justify-content: ${function (props) {
    return props.justifyContent;
  }};
  flex-direction: ${function (props) {
    return props.flexDirection || 'row';
  }};
  font-size: ${function (props) {
    return props.fontSize;
  }};
  font-family: ${function (props) {
    return props.fontFamily;
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
  position: ${function (props) {
    return props.position;
  }};
`;

export default Flex;
