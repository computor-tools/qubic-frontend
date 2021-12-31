import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Button = styled.button`
  color: #fff;
  padding: 10px 0px;
  align-self: center;
  font-weight: bold;
  position: absolute;
  display: flex;
  background: transparent;
  border: 0;
  cursor: pointer;
  left: calc(-1vw - 20px);
  transition: color 0.3s;

  &:hover {
    color: #00ffe9;
  }
`;

const BackButton = function () {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Button onClick={() => navigate(location.state?.from?.pathname === '/login' ? -2 : -1)}>
      <ArrowBackIcon />
    </Button>
  );
};

export default BackButton;
