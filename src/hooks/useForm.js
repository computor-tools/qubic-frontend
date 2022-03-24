import { useState, useEffect, useCallback, useRef } from 'react';

const defaultOptions = {
  validate: undefined,
  name: 'form',
  fields: [],
};

const useForm = function (initialState = {}, options) {
  const { required, fields, validate: validationFn } = { ...defaultOptions, ...options };
  const [values, onChange] = useState(initialState);
  const [valid, setValid] = useState(true);
  const [error, setError] = useState(null);
  const [pristine, setPristine] = useState(true);
  const prevError = useRef({});
  const newInit = useRef(undefined);

  const initialize = useCallback(
    function (newValue = values) {
      newInit.current = newValue;
      prevError.current = null;
      onChange(newValue);
      setError(null);
      setValid(true);
      setPristine(true);
    },
    [values]
  );

  const validate = useCallback(
    function () {
      if (!validationFn) return undefined;
      let formIsValid = true;
      let inputError = {};
      let inputValid = {};
      prevError.current = {};
      for (const inputName of fields) {
        const inputVal = values[inputName];
        if (
          !required[inputName] &&
          (inputVal === '' || inputVal === undefined || inputVal === null)
        ) {
          inputValid[inputName] = true;
          continue;
        }
        const inputValue = values[inputName] || '';
        const validation = validationFn(inputValue);
        const inputIsValid = validation === true || validation === '';
        if (inputIsValid) {
          inputValid[inputName] = true;
        } else {
          inputValid[inputName] = false;
          inputError[inputName] = validation;
          prevError.current[inputName] = inputValue;
          if (formIsValid) formIsValid = false;
        }
      }
      if (Object.keys(inputValid).length > 0) setValid(inputValid);
      if (Object.keys(inputError).length > 0) setError(inputError);
      if (formIsValid) setValid(true);
      return formIsValid;
    },
    [validationFn, required, values, fields]
  );

  useEffect(
    function () {
      let inputPristine = {};
      let inputError = {};
      for (const inputName of fields) {
        if (
          ((values[inputName] !== initialState[inputName] && newInit.current === undefined) ||
            (newInit.current !== undefined && values[inputName] !== newInit.current[inputName])) &&
          (pristine[inputName] || pristine === true)
        ) {
          inputPristine[inputName] = false;
        }
        if (
          prevError.current !== null &&
          values[inputName] !== prevError.current[inputName] &&
          !valid[inputName]
        ) {
          inputError[inputName] = false;
        }
      }
      if (Object.keys(inputPristine).length > 0) {
        setPristine(inputPristine);
      }
      if (Object.keys(inputError).length > 0) {
        setError(inputError);
      }
    },
    [pristine, initialState, values, valid, fields]
  );

  return {
    initialize,
    onChange,
    values,
    valid,
    error,
    pristine,
    validate,
  };
};

export default useForm;
