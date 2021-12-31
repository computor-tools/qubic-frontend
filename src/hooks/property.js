import { useEffect, useState } from 'react';

export const usePropery = function (ref, property, ...eventNames) {
  const [value, setValue] = useState(ref.current?.[property] || null);

  useEffect(
    function () {
      const listener = function () {
        setValue(ref.current[property]);
      };

      if (ref.current !== undefined) {
        setValue(ref.current[property]);

        if (ref.current !== window) {
          if (eventNames.indexOf('resize') > -1) {
            new ResizeObserver(function () {
              setValue(ref.current[property]);
            }).observe(ref.current);
          }
        } else {
          for (const eventName of eventNames) {
            window.addEventListener(eventName, listener);
          }
        }

        return function () {
          for (const eventName of eventNames) {
            window.removeEventListener(eventName, listener);
          }
        };
      }
    },
    [eventNames, property, ref]
  );

  return value;
};
