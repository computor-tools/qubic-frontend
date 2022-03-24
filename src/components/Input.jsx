import { Fragment, memo } from 'react';
import styled from 'styled-components';
import Flex, { FlexChild } from './Flex';
import HelperText from './HelperText';

const Input = styled.input`
  padding: 1vh 1vw;
  margin: 0 0 1vh 0;
  margin-left: ${function (props) {
    return props.marginLeft;
  }};
  margin-bottom: ${function (props) {
    return props.marginBottom;
  }};
  width: ${function (props) {
    return props.width;
  }};
  box-sizing: border-box;
  background-color: ${function (props) {
    return props.backgroundColor || '#333';
  }};
  border-radius: 30px;
  border: 1px solid transparent;
  color: #fff;
  font-size: ${function (props) {
    return props.fontSize || '20px';
  }};
  font-family: Inconsolata, monospace;
  transition: border 0.4s;
  border-color: ${function (props) {
    return props?.error ? '#db3918' : 'inherit';
  }};
  ${function (props) {
    return props.disabled && `background-color: unset;`;
  }}
  &:focus {
    border-color: #00ffe9;
  }
`;

const defaultProps = {
  error: null,
  type: 'text',
  invalid: false,
  placeholder: '',
  errorBelow: false,
  errorRight: false,
  pristine: true,
  defaultValue: null,
  autocomlete: 'off',
};
export const InputField = function (props) {
  const {
    defaultValue,
    name,
    value,
    error,
    type,
    onChange,
    pristine,
    placeholder,
    errorBelow,
    errorRight,
    disabled,
    autocomplete,
  } = {
    ...defaultProps,
    ...props,
  };

  const marginBottom = errorBelow ? '30px' : undefined;

  return (
    <Fragment>
      <Flex flexDirection="column">
        <FlexChild position="relative">
          <Input
            {...(marginBottom && { marginBottom })}
            placeholder={placeholder}
            name={name}
            type={type}
            error={error}
            disabled={disabled}
            autocomplete={autocomplete}
            {...(defaultValue !== null && !onChange && value === undefined && { defaultValue })}
            {...(value !== undefined && onChange && { value })}
            {...(onChange && {
              onChange: function (event) {
                onChange(event.target.value);
              },
            })}
          />
          {error && !pristine && (
            <HelperText right={errorRight} below={errorBelow} error={error}>
              {error}
            </HelperText>
          )}
        </FlexChild>
        {props.children && <FlexChild>{props.children}</FlexChild>}
      </Flex>
    </Fragment>
  );
};

InputField.displayName = 'InputField';

export default memo(Input);
