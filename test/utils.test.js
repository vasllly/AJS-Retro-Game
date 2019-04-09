import { calcTileType, calcHealthLevel } from '../src/js/utils';

function createTile(size) {
  const tiles = [];
  for (let i = 0; i < size ** 2; i += 1) tiles.push(calcTileType(i, size));
  return tiles;
}

test('test calcTileType size = 0', () => {
  const received = createTile(0);
  const expected = [];
  expect(received).toEqual(expected);
});

test('test calcTileType size = 1', () => {
  const received = createTile(1);
  const expected = ['center'];
  expect(received).toEqual(expected);
});

test('test calcTileType size = 2', () => {
  const received = createTile(2);
  const expected = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  expect(received).toEqual(expected);
});

test('test calcTileType size = 3', () => {
  const received = createTile(3);
  const expected = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];
  expect(received).toEqual(expected);
});

test('test calcTileType size = 8', () => {
  const received = createTile(8);
  const expected = [
    'top-left', 'top', 'top', 'top', 'top', 'top', 'top', 'top-right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'left', 'center', 'center', 'center', 'center', 'center', 'center', 'right',
    'bottom-left', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom-right'];
  expect(received).toEqual(expected);
});

test('test calcHealthLevel', () => {
  const received = [
    calcHealthLevel(0),
    calcHealthLevel(10),
    calcHealthLevel(15),
    calcHealthLevel(20),
    calcHealthLevel(50),
    calcHealthLevel(60),
    calcHealthLevel(100),
  ];
  const expected = ['critical', 'critical', 'normal', 'normal', 'high', 'high', 'high'];
  expect(received).toEqual(expected);
});
