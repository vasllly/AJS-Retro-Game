import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.type = 'Vampire';
    this.attack = 40;
    this.defence = 10;
  }
}
