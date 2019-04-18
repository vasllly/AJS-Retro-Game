import Team from './Team';
import { positionsGenerator } from './generators';

export default class GameState {
  static positioning(type, team) {
    let positions = [];
    if (type === 'user') positions = positionsGenerator(0, 2, team.length);
    if (type === 'war') positions = positionsGenerator(6, 8, team.length);
    for (let index = 0; index < team.length; index += 1) {
      // eslint-disable-next-line no-param-reassign
      team[index].position = positions[index];
    }
    return team;
  }

  static from(object) {
    // TODO: create object
    if (JSON.stringify(object) === JSON.stringify({})) {
      return {
        userTeam: this.positioning('user', new Team('user', 1, 2).team),
        warTeam: this.positioning('war', new Team('war', 1, 2).team),
        step: 0,
      };
    }
    return null;
  }
}
