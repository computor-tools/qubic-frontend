import styled, { css } from 'styled-components';

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 1vw;
  padding-top: ${function (props) {
    return props.paddingX;
  }};
  padding-bottom: ${function (props) {
    return props.paddingX;
  }};
  padding-right: ${function (props) {
    return props.paddingRight;
  }};

  ${function (props) {
    return (
      props.striped &&
      css`
        &:nth-child(odd) {
          background-color: #121212;
        }
      `
    );
  }}

  ${function (props) {
    return (
      props.current &&
      css`
        color: #00ffe9;
        background: rgba(0, 117, 107, 0.3) !important;
      `
    );
  }}
`;

export const Cell = styled.div`
  display: flex;
  flex: ${function (props) {
    return props.flex;
  }};
  justify-content: ${function (props) {
    return props.justifyContent;
  }};
  align-items: ${function (props) {
    return props.alignItems;
  }};
  flex-direction: ${function (props) {
    return props.flexDirection;
  }};
`;

export default Row;
