import React, { useState, useEffect, useContext } from 'react';
import { ConnectionContext } from '../components/ConnectionProvider';
import Container from '../components/Container';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { InputField } from '../components/Input';
import Button from '../components/Button';
import styled from 'styled-components';
import Heading from '../components/Heading';
import { validateIpAddress } from '../utils/validateIpAddress';
import Form from '../components/Form';

const ComputorSettings = styled.div`
  width: 300px;
`;

const Settings = function () {
  const connection = useContext(ConnectionContext);
  const computors = connection.peers().map(({ ip }) => ip);
  const [computor0, computor1, computor2] = computors;
  const [values, setValues] = useState(undefined);
  const [editing, setEditing] = useState(null);

  const formInput = {
    initialState: {
      computor0: computor0 ?? '',
      computor1: computor1 ?? '',
      computor2: computor2 ?? '',
    },
    values,
    name: 'computors',
    validate: validateIpAddress,
    onSubmit: function (formValues) {
      connection.setPeer(0, formValues.computor0);
      connection.setPeer(1, formValues.computor1);
      connection.setPeer(2, formValues.computor2);
      setEditing(false);
    },
  };

  useEffect(
    function () {
      if (editing === false) {
        setValues({
          computor0: computor0 ?? '',
          computor1: computor1 ?? '',
          computor2: computor2 ?? '',
        });
      } else {
        if (editing === null && (computor0 || computor1 || computor2)) {
          setEditing(false);
        }
        setValues(null);
      }
    },
    [computor0, computor1, computor2, editing]
  );

  return (
    <Container>
      <ComputorSettings>
        <Heading>Computors</Heading>
        <Form {...formInput} disabled={editing === false}>
          <InputField name="computor0" errorRight />
          <InputField name="computor1" errorRight />
          <InputField name="computor2" errorRight />
          {editing !== false ? (
            <Button type="submit" flex alignItems="center">
              <SaveIcon /> Save
            </Button>
          ) : (
            <Button
              flex
              alignItems="center"
              type="button"
              onClick={function (event) {
                event.preventDefault();
                return setEditing(true);
              }}
            >
              <EditIcon />
              Edit
            </Button>
          )}
        </Form>
      </ComputorSettings>
    </Container>
  );
};

export default Settings;
