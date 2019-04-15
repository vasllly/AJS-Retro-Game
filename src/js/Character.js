export default class Character {
  constructor(level) {
    this.level = level;
    this.health = 100;
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') throw new Error('Нельзя создать объект класса Character!');
  }
}
