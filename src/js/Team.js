import { generateTeam } from './generators';

export default class Team {
  constructor(type, maxLevel, characterCount) {
    if (type === 'user') {
      this.team = generateTeam([
        { type: 'swordsman' },
        { type: 'bowman' },
      ], maxLevel, characterCount);
    }
    if (type === 'war') {
      this.team = generateTeam([
        { type: 'daemon' },
        { type: 'undead' },
        { type: 'vampire' },
      ], maxLevel, characterCount);
    }
  }
}
