import type * as i from 'types';

export type Layer = {
  collarMargin: number;
  blocks: i.Block[];
};

export type Block = {
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
};
