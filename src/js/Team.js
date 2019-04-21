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

  * [Symbol.iterator]() {
    // сортировка по степени опасности
    this.team.sort((chA, chB) => chB.attack + chB.attackRange - chA.attack - chA.attackRange);
    for (let i = 0; i < this.team.length; i += 1) yield this.team[i];
  }

  filter() {
    this.team = this.team.filter(character => character.health > 0);
  }

  count() {
    return this.team.length;
  }
}
