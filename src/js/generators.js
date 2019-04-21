import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

function randomGenerator(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function positionGenerator(xMin, xMax) {
  return Math.floor(Math.random() * 8) * 8 + randomGenerator(xMin, xMax);
}

export function positionsGenerator(xMin, xMax, count) {
  const positions = [];
  for (let index = 0; index < count; index += 1) {
    let position = positionGenerator(xMin, xMax);
    while (positions.indexOf(position) !== -1) {
      position = positionGenerator(xMin, xMax);
    }
    positions.push(position);
  }
  return positions;
}

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const level = randomGenerator(1, maxLevel + 1);
  const { type } = allowedTypes[randomGenerator(0, allowedTypes.length)];
  switch (type) {
    case 'swordsman': yield new Swordsman(level);
      break;
    case 'bowman': yield new Bowman(level);
      break;
    case 'magician': yield new Magician(level);
      break;
    case 'daemon': yield new Daemon(level);
      break;
    case 'undead': yield new Undead(level);
      break;
    case 'vampire': yield new Vampire(level);
      break;
    default:
      break;
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    team[i] = characterGenerator(allowedTypes, maxLevel).next().value;
  }
  return team;
}

export function positioning(type, team) {
  let positions = [];
  if (type === 'user') positions = positionsGenerator(0, 2, [...team].length);
  if (type === 'war') positions = positionsGenerator(6, 8, [...team].length);
  [...team].forEach((character, index) => {
    // eslint-disable-next-line no-param-reassign
    character.position = positions[index];
  });
  return team;
}
