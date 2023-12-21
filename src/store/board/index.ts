import * as i from 'types';
import { create } from 'zustand';

import { BLOCK_BASE } from 'utils/constants';

type BoardStore = {
  currentLayerIndex: number;
  setCurrentLayer: (layerIndex: number) => void;

  layers: i.Layer[];
  setLayers: (layers: i.Layer[]) => void;
};

export const useBoardStore = create<BoardStore>()((set) => ({
  currentLayerIndex: 0,
  setCurrentLayer(layerIndex) {
    set((state) => {
      return {
        ...state,
        currentLayerIndex: layerIndex,
      };
    });
  },

  layers: [
    {
      // @TODO index is redundant because you can just use the array index
      // create order instead to represent the laying order (text in the UI), should default to the index
      index: 0,
      blocks: [BLOCK_BASE],
    },
  ],
  setLayers: (layers) => {
    set((state) => {
      return {
        ...state,
        layers,
      };
    });
  },
}));

export function useBlocks() {
  const { currentLayerIndex, layers } = useBoardStore();
  const currentLayer = layers[currentLayerIndex];
  return currentLayer.blocks;
}
