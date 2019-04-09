/* eslint-disable no-unused-vars */
export function calcTileType(index, boardSize) {
  // TODO: write logic here
  const tileType = [];
  if (index < boardSize) tileType.push('top');
  if (index >= (boardSize ** 2) - boardSize) tileType.push('bottom');
  if (index % boardSize === 0) tileType.push('left');
  if (index % boardSize === boardSize - 1) tileType.push('right');

  if (tileType.length === 2) return `${tileType[0]}-${tileType[1]}`;
  if (tileType.length === 1) return tileType[0];
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
