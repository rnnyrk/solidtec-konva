import type * as i from 'types';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { useBlocks, useBoardStore } from 'store/board';
import { useKonvaContext } from 'modules/konva/KonvaContext';

export function useKeys() {
  const { selected } = useKonvaContext()!;
  const blocks = useBlocks();
  const { currentLayerIndex, layers, setLayers } = useBoardStore();

  // @TODO Add board constraints as in onDragMove

  function onUpdateLayers(newBlocks: i.Block[]) {
    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);
  }

  useHotkeys(Key.ArrowUp, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    newBlocks[selected] = {
      ...newBlocks[selected],
      y: newBlocks[selected].y - 1,
    };

    onUpdateLayers(newBlocks);
  });

  useHotkeys(Key.ArrowRight, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    newBlocks[selected] = {
      ...newBlocks[selected],
      x: newBlocks[selected].x + 1,
    };

    onUpdateLayers(newBlocks);
  });

  useHotkeys(Key.ArrowDown, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    newBlocks[selected] = {
      ...newBlocks[selected],
      y: newBlocks[selected].y + 1,
    };

    onUpdateLayers(newBlocks);
  });

  useHotkeys(Key.ArrowLeft, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    newBlocks[selected] = {
      ...newBlocks[selected],
      x: newBlocks[selected].x - 1,
    };

    onUpdateLayers(newBlocks);
  });
}
