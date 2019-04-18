import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.type = 'undead';
    this.attack = 25;
    this.defence = 25;
    this.attackRange = 1;
    this.speed = 4;
  }
}
