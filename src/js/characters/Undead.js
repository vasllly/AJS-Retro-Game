import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.type = 'Undead';
    this.attack = 25;
    this.defence = 25;
  }
}
