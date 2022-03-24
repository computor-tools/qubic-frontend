import { useEffect, useMemo, cloneElement, memo } from 'react';
import useForm from '../hooks/useForm';

const Form = function (props) {
  const [fields, required] = useMemo(
    function () {
      let inputFileds = [],
        inputRequired = {};
      for (const [index, child] of props.children.entries()) {
        if (child.type.displayName === 'InputField') {
          inputFileds.push(child.props.name ?? `input_${index}`);
          if (child.props.required) inputRequired[child.propps.name] = true;
        }
      }
      return [inputFileds, inputRequired];
    },
    [props.children]
  );

  const form = useForm(props.initialState, {
    name: props.name,
    fields,
    required,
    validate: props.validate,
  });

  useEffect(
    function () {
      if (props.values) {
        form.initialize(props.values);
      }
    },
    [props.values, form]
  );

  const renderChild = function (child, index) {
    switch (child.type.displayName) {
      case 'InputField':
        return cloneElement(child, {
          key: index,
          ...child.props,
          value: form.values[child.props.name],
          valid: form.valid === true || [child.props.name],
          error: form.error ? form.error[child.props.name] : null,
          pristine: form.pristine === true || form.pristine[child.props.name],
          disabled: props.disabled,
          onChange: function (value) {
            return form.onChange(function (prevState) {
              return {
                ...prevState,
                [child.props.name]: value,
              };
            });
          },
        });
      default:
        return child;
    }
  };

  return (
    <form
      onSubmit={function (event) {
        event.preventDefault();
        if (form.validate() === true) {
          form.initialize(form.values);
          props.onSubmit(form.values);
        }
      }}
    >
      {props.children.map(renderChild)}
    </form>
  );
};
export default memo(Form);
