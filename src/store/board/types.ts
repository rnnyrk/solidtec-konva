import type * as i from 'types';

export type Layer = {
  index: number;
  blocks: i.Block[];
};

export type Block = {
  x: number;
  y: number;
  width: number;
  height: number;
};
