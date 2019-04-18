import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.type = 'vampire';
    this.attack = 40;
    this.defence = 10;
    this.attackRange = 2;
    this.speed = 2;
  }
}
