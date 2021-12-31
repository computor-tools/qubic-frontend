import { usePropery } from './property';

export const useWindowWidth = function () {
  return usePropery({ current: window }, 'innerWidth', 'resize');
};

export const useWindowHeight = function () {
  return usePropery({ current: window }, 'innerHeight', 'resize');
};
