import type * as i from 'types';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { useBlocks, useBoardStore } from 'store/board';
import { useKonvaContext } from 'modules/konva/KonvaContext';

import { useBoundingBox } from './useBoundingBox';

export function useKeys() {
  const { selected } = useKonvaContext()!;
  const blocks = useBlocks();
  const { getBoundingBox } = useBoundingBox();
  const { currentLayerIndex, layers, setLayers } = useBoardStore();

  function onUpdateLayers(newBlocks: i.Block[]) {
    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);
  }

  useHotkeys(Key.ArrowUp, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    const pos = {
      x: newBlocks[selected].x,
      y: newBlocks[selected].y - 1,
    };

    const { x: newXPos, y: newYPos } = getBoundingBox({
      pos,
      rotation: newBlocks[selected].rotation,
    });

    newBlocks[selected] = {
      ...newBlocks[selected],
      x: newXPos,
      y: newYPos,
    };

    onUpdateLayers(newBlocks);
  });

  useHotkeys(Key.ArrowRight, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    const pos = {
      x: newBlocks[selected].x + 1,
      y: newBlocks[selected].y,
    };

    const { x: newXPos, y: newYPos } = getBoundingBox({
      pos,
      rotation: newBlocks[selected].rotation,
    });

    newBlocks[selected] = {
      ...newBlocks[selected],
      x: newXPos,
      y: newYPos,
    };

    onUpdateLayers(newBlocks);
  });

  useHotkeys(Key.ArrowDown, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    const pos = {
      x: newBlocks[selected].x,
      y: newBlocks[selected].y + 1,
    };

    const { x: newXPos, y: newYPos } = getBoundingBox({
      pos,
      rotation: newBlocks[selected].rotation,
    });

    newBlocks[selected] = {
      ...newBlocks[selected],
      x: newXPos,
      y: newYPos,
    };

    onUpdateLayers(newBlocks);
  });

  useHotkeys(Key.ArrowLeft, () => {
    if (selected === null) return;

    const newBlocks = [...blocks];
    const pos = {
      x: newBlocks[selected].x - 1,
      y: newBlocks[selected].y,
    };

    const { x: newXPos, y: newYPos } = getBoundingBox({
      pos,
      rotation: newBlocks[selected].rotation,
    });

    newBlocks[selected] = {
      ...newBlocks[selected],
      x: newXPos,
      y: newYPos,
    };

    onUpdateLayers(newBlocks);
  });
}
