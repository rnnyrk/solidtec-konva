import * as i from 'types';
import { create } from 'zustand';

import { BLOCK_BASE, BLOCK_SIZE } from 'utils/constants';

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
      collarMargin: BLOCK_SIZE * 3,
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

export function useCurrentLayer() {
  const { currentLayerIndex, layers } = useBoardStore();
  return layers[currentLayerIndex];
}

export function useBlocks() {
  const { currentLayerIndex, layers } = useBoardStore();
  const currentLayer = layers[currentLayerIndex];
  return currentLayer.blocks;
}
