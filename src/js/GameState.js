import Team from './Team';
import { positionsGenerator } from './generators';

export default class GameState {
  static positioning(type, team) {
    let positions = [];
    if (type === 'user') positions = positionsGenerator(0, 2, [...team].length);
    if (type === 'war') positions = positionsGenerator(6, 8, [...team].length);
    [...team].forEach((character, index) => {
      // eslint-disable-next-line no-param-reassign
      character.position = positions[index];
    });
    return team;
  }

  static from(object) {
    // TODO: create object
    if (JSON.stringify(object) === JSON.stringify({})) {
      return {
        userTeam: this.positioning('user', new Team('user', 1, 2)),
        warTeam: this.positioning('war', new Team('war', 1, 2)),
        step: 0,
      };
    }
    return null;
  }
}
