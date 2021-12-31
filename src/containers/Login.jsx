import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../components/AuthProvider';
import Heading from '../components/Heading';
import SeedInput from '../components/SeedInput';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWidth } from '../hooks/element';

const Error = styled.div`
  color: #db3918;
  padding: 1vh 1vw 2vh 1vw;
`;

const Form = styled.form`
  width: ${function (props) {
    return props.width;
  }};
  margin: auto;
`;

const Checkbox = styled.div`
  padding: 1vh 1vw;

  label {
    margin-left: 10px;
  }
`;

const Login = function () {
  const navigate = useNavigate();
  const location = useLocation();
  const [seed, setSeed] = useState('');
  const { loggedIn, login, validateSeed, error } = useContext(AuthContext);
  const inputRef = useRef();
  const inputWidth = useWidth(inputRef);
  const [inputType, setInputType] = useState('password');

  useEffect(
    function () {
      if (loggedIn) {
        console.log(location);
        navigate(location.state?.from?.pathname || '/', {
          replace: true,
          state: { from: location },
        });
      }
    },
    [location, location.state?.from?.pathname, loggedIn, navigate]
  );

  return (
    <Form
      width={inputWidth + 'px'}
      onSubmit={function (event) {
        event.preventDefault();
        login(seed);
      }}
    >
      <Heading>Seed</Heading>
      {error !== undefined && <Error>{error}</Error>}
      <SeedInput
        type={inputType}
        ref={inputRef}
        value={seed}
        onChange={function (event) {
          validateSeed(event.target.value);
          setSeed(event.target.value);
        }}
      />
      <Checkbox>
        <Input
          type="checkbox"
          name="show-seed"
          onClick={function () {
            setInputType(function (value) {
              return value == 'text' ? 'password' : 'text';
            });
          }}
        />
        <label htmlFor="show-seed">Show seed</label>
      </Checkbox>
      <Button width={inputWidth + 'px'} type="submit">
        Login
      </Button>
    </Form>
  );
};

export default Login;
