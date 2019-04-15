import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level);
    this.type = 'Daemon';
    this.attack = 10;
    this.defence = 40;
  }
}
