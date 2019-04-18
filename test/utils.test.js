import {
  calcTileType,
  calcHealthLevel,
  generateMessage,
  getXY,
  canWalk,
  canAttack,
} from '../src/js/utils';
import Bowman from '../src/js/characters/Bowman';

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

test('test generateMessage for Bowman', () => {
  const character = new Bowman(1);
  const received = generateMessage(character);
  const expected = '🎖1 ⚔25 🛡25 ❤100';
  expect(received).toBe(expected);
});

test('test getXY(16)', () => {
  const received = getXY(16);
  const expected = [0, 2];
  expect(received).toEqual(expected);
});

test('test getXY(35)', () => {
  const received = getXY(35);
  const expected = [3, 4];
  expect(received).toEqual(expected);
});

test('test canWalk', () => {
  const character = new Bowman(1);
  character.position = 16;
  const received = canWalk(character, 18);
  const expected = true;
  expect(received).toBe(expected);
});

test('test canWalk', () => {
  const character = new Bowman(1);
  character.position = 16;
  const received = canWalk(character, 32);
  const expected = true;
  expect(received).toBe(expected);
});

test('test canWalk', () => {
  const character = new Bowman(1);
  character.position = 16;
  const received = canWalk(character, 34);
  const expected = true;
  expect(received).toBe(expected);
});

test('test canWalk', () => {
  const character = new Bowman(1);
  character.position = 16;
  const received = canWalk(character, 19);
  const expected = false;
  expect(received).toBe(expected);
});

test('test canWalk', () => {
  const received = canWalk(undefined, 19);
  const expected = false;
  expect(received).toBe(expected);
});

test('test canAttack', () => {
  const character = new Bowman(1);
  character.position = 16;
  const received = canAttack(character, 18);
  const expected = true;
  expect(received).toBe(expected);
});

test('test canAttack', () => {
  const character = new Bowman(1);
  character.position = 16;
  const received = canAttack(character, 19);
  const expected = false;
  expect(received).toBe(expected);
});

test('test canAttack', () => {
  const received = canAttack(undefined, 19);
  const expected = false;
  expect(received).toBe(expected);
});
