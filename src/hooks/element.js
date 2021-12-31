import { usePropery } from './property';

export const useHeight = function (ref) {
  return usePropery(ref, 'offsetHeight', 'resize');
};

export const useWidth = function (ref) {
  return usePropery(ref, 'offsetWidth', 'resize');
};
