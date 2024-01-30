import { UseFormReset } from 'react-hook-form';

import { useModal } from 'hooks';
import { useBoardStore, useCurrentLayer } from 'store/board';
import { BLOCK_BASE, BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';
import { btnClass, Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';
import { NewLayerModal, type NewLayerModalValues } from './modals/NewLayerModal';

export function Layers() {
  const { stageRef, setSelected } = useKonvaContext()!;
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  const { currentLayerIndex, setCurrentLayer, layers, setLayers } = useBoardStore();
  const currentLayer = useCurrentLayer();

  const collarMargin = currentLayer.collarMargin * 2;
  const stageWidthIncMargin = STAGE_WIDTH + collarMargin;
  const stageHeightIncMargin = STAGE_HEIGHT + collarMargin;

  function onSetActiveLayer(index: number) {
    setSelected(null);
    setCurrentLayer(index);
  }

  function onDuplicateLayer(data: NewLayerModalValues) {
    let copyBlocks = [...currentLayer.blocks];

    copyBlocks = copyBlocks.map((block) => {
      // Calculate rotation offsets
      let rotationOffsetX = BLOCK_WIDTH;
      let rotationOffsetY = BLOCK_HEIGHT;

      if (block.rotation === 90) {
        rotationOffsetX = -BLOCK_HEIGHT;
        rotationOffsetY = BLOCK_WIDTH;
      } else if (block.rotation === 180) {
        rotationOffsetX = -BLOCK_WIDTH;
        rotationOffsetY = -BLOCK_HEIGHT;
      } else if (block.rotation === 270) {
        rotationOffsetX = BLOCK_HEIGHT;
        rotationOffsetY = -BLOCK_WIDTH;
      }

      // Apply flipping for X and Y coordinates
      let newX = block.x;
      let newY = block.y;

      if (data.flipX) {
        newX = stageWidthIncMargin - block.x - rotationOffsetX;
      }

      if (data.flipY) {
        newY = stageHeightIncMargin - block.y - rotationOffsetY;
      }

      return {
        ...block,
        x: newX,
        y: newY,
      };
    });

    return copyBlocks;
  }

  function onNewLayer(data: NewLayerModalValues, reset: UseFormReset<NewLayerModalValues>) {
    if (!stageRef.current) return;

    let newBlocks = [BLOCK_BASE];
    if (data.duplicate) {
      newBlocks = [...onDuplicateLayer(data)];
    }

    const newLayers = [
      ...layers,
      {
        collarMargin: data.duplicate ? currentLayer.collarMargin : Number(data.collarMargin),
        blocks: newBlocks,
      },
    ];

    setLayers(newLayers);
    setCurrentLayer(newLayers.length - 1);
    setSelected(null);

    onCloseModal();
    reset();
  }

  return (
    <div className="flex flex-col justify-between">
      {layers.map((_, index) => {
        return (
          <Button
            key={`layer-button-${index}`}
            className="mb-2"
            onClick={() => onSetActiveLayer(index)}
            variant={index === currentLayerIndex ? 'primary' : 'alternative'}
            size="xl"
          >
            Layer {index + 1}
          </Button>
        );
      })}
      {layers.length < 4 && (
        <NewLayerModal
          title="Add new layer"
          description="Duplicate current layer or create new blanco layer by selecting none."
          onCallback={onNewLayer}
          onClose={onCloseModal}
          onOpen={onOpenModal}
          isOpen={isOpen}
        >
          <div className={btnClass({ variant: 'secondary', size: 'xl' })}>New layer</div>
        </NewLayerModal>
      )}
    </div>
  );
}
