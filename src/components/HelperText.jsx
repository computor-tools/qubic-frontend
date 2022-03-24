import styled from 'styled-components';

const HelperText = styled.div`
  font-family: Inconsolata, monospace;
  width: 100%;
  display: block;
  font-size: ${function (props) {
    return props.fontSize || '1rem';
  }};
  color: ${function (props) {
    return props.error ? '#db3918' : 'inherit';
  }};
  ${function (props) {
    const fontSize = props.fontSize || '1rem';
    if (props.below) {
      return `position: absolute;
              top: calc(100% - ${fontSize});
              left: 50%;
              transform: translate(-50%, -50%);
            `;
    }
    if (props.right) {
      return `position: absolute;
              top: 50%;
              left: 100%;
              transform: translate(${fontSize}, -50%);
            `;
    }
  }};
`;

export default HelperText;
