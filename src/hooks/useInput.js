import { useCallback, useEffect, useRef, useState } from 'react';

const defaultOptions = {
  validate: undefined,
  name: 'input',
  type: 'text',
  placeholder: '',
  required: true,
};

const useInputField = function (initialState = '', options = defaultOptions) {
  const {
    required,
    name,
    type,
    placeholder,
    validate: validationFn,
  } = { ...defaultOptions, ...options };
  const [value, onChange] = useState(initialState);
  const [valid, setValid] = useState(true);
  const [error, setError] = useState(null);
  const [pristine, setPristine] = useState(true);
  const prevError = useRef(null);
  const newInit = useRef(undefined);

  const initialize = useCallback(
    function (newValue = value) {
      newInit.current = newValue;
      prevError.current = null;
      onChange(newValue);
      setError(null);
      setValid(true);
      setPristine(true);
    },
    [value]
  );

  const validate = useCallback(
    function () {
      if (!validationFn) return undefined;
      if (!required && (value === '' || value === undefined || value === null)) return true;
      const validation = validationFn(value);
      const isValid = validation === true || validation === '';
      if (!isValid) {
        setError(validation);
        prevError.current = value;
      }
      setValid(isValid);
      return validation === true || validation;
    },
    [value, validationFn, required]
  );

  useEffect(
    function () {
      if (
        ((value !== initialState && newInit.current === undefined) ||
          (newInit.current !== undefined && value !== newInit.current)) &&
        pristine
      ) {
        setPristine(false);
      }

      if (prevError.current !== null && value !== prevError.current && !valid) {
        setValid(true);
        setError(null);
      }
    },
    [initialState, pristine, value, valid]
  );

  return {
    initialState,
    value,
    onChange,
    initialize,
    pristine,
    dirty: !pristine,
    valid,
    invalid: !valid,
    validate,
    error,
    placeholder,
    type,
    name,
  };
};

export default useInputField;
