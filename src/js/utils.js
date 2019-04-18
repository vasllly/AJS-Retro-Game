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

export function generateMessage(character) {
  return `\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`;
}

export function getXY(index) {
  return [index % 8, Math.floor(index / 8)];
}

export function canWalk(character, cursor) {
  if (character) {
    const charXY = getXY(character.position);
    const cursorXY = getXY(cursor);
    const dX = Math.abs(charXY[0] - cursorXY[0]);
    const dY = Math.abs(charXY[1] - cursorXY[1]);

    if (dY === 0 && dX <= character.speed) return true;
    if (dX === 0 && dY <= character.speed) return true;
    if (dX === dY && dX <= character.speed) return true;
  }
  return false;
}

export function canAttack(character, cursor) {
  if (character) {
    const charXY = getXY(character.position);
    const cursorXY = getXY(cursor);
    const dX = Math.abs(charXY[0] - cursorXY[0]);
    const dY = Math.abs(charXY[1] - cursorXY[1]);
    if (dX <= character.attackRange && dY <= character.attackRange) return true;
  }
  return false;
}
