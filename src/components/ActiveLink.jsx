import { useLocation } from 'react-router';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
  padding: ${function (props) {
    return props.padding || '1vh 10px';
  }};
  font-weight: bold;
  color: #fff;
  font-size: ${function (props) {
    return props.fontSize || '14px';
  }};
  transition: color 0.3s;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  &:hover,
  &.current {
    color: #00ffe9;
  }

  &.no-underline {
    border-bottom: 0 !important;
  }
`;

const ActiveLink = function ({ to, className, padding, fontSize, children }) {
  const location = useLocation();

  if (className === undefined) {
    className = '';
  }

  if (location.pathname.split('/')[1] === to.slice(1) || location.pathname === to) {
    className += ' current';

    if (location.pathname === to) {
      className += ' final';
    }
  }

  return (
    <StyledLink to={to} className={className} padding={padding} fontSize={fontSize}>
      {children}
    </StyledLink>
  );
};

export default ActiveLink;
