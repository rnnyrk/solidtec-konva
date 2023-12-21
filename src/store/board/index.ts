import * as i from 'types';
import { create } from 'zustand';

import { BLOCK_BASE } from 'utils/constants';

type BoardStore = {
  currentLayerIndex: number;

  layers: i.Layer[];
  setLayers: (layers: i.Layer[]) => void;
};

export const useBoardStore = create<BoardStore>()((set) => ({
  currentLayerIndex: 0,

  layers: [
    {
      index: 0,
      blocks: [BLOCK_BASE],
    },
  ],
  setLayers: (layers) =>
    set((state) => {
      return {
        ...state,
        layers,
      };
    }),
}));
