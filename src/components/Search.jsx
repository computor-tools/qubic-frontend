import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';

const Input = styled.input`
  width: 100%;
  background-color: #121212;
  border: 1px solid #777;
  border-right: 0;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  padding: 6px 10px;
  color: #fff;
  font-size: 16px;
  z-index: 1;
  transition: border-color 0.4s;

  &:focus {
    border: 1px solid #00ffe9;
    border-right: 0;
  }
`;

const Button = styled.button`
  background: #121212;
  color: #fff;
  font-weight: bold;
  border: 1px solid #777;
  border-left: 0;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: border-color 0.4s, color 0.4s;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  padding: 0 0 0 calc(1vw - 10px);
  justify-content: flex-end;
  align-self: center;

  &:focus-within {
    button {
      border-top-color: #00ffe9;
      border-bottom-color: #00ffe9;
      border-right-color: #00ffe9;
      color: #00ffe9;
    }

    input {
      border: 1px solid #00ffe9;
      border-right: 0;
    }
  }
`;

const Search = function () {
  return (
    <Container>
      <Input type="text" placeholder="Search" />
      <Button>
        <SearchIcon />
      </Button>
    </Container>
  );
};

export default Search;
