import Team from './Team';
import { positioning } from './generators';

export default class GameState {
  static from(object) {
    // TODO: create object
    if (JSON.stringify(object) === JSON.stringify({})) {
      return {
        userTeam: positioning('user', new Team('user', 1, 2)),
        warTeam: positioning('war', new Team('war', 1, 2)),
        step: 0,
        score: 0,
        hiScore: 0,
        level: 1,
      };
    }
    return null;
  }
}
