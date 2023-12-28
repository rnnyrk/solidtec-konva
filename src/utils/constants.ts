export const BLOCK_SIZE = 20; // 10cm in real life
export const MAX_BLOCKS = 6;

// Stage dimensions are based on real pallet dimensions
// Pallet 180cm x 120cm. 10cm = 20px
export const STAGE_WIDTH = BLOCK_SIZE * 36;
export const STAGE_HEIGHT = BLOCK_SIZE * 24;
export const BLOCK_WIDTH = BLOCK_SIZE * 10;
export const BLOCK_HEIGHT = BLOCK_SIZE * 6;

export const BLOCK_BASE = {
  order: 1,
  x: 0,
  y: 0,
  width: BLOCK_WIDTH,
  height: BLOCK_HEIGHT,
  rotated: false,
};
