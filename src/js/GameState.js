import Team from './Team';
import { positioning, characterGenerator } from './generators';

export default class GameState {
  static from(object) {
    // TODO: create object
    if (object) {
      const userTeam = new Team('user', 1, object.userTeam.team.length);
      object.userTeam.team.forEach((character, index) => {
        userTeam.team[index] = characterGenerator([character], 1).next().value;
        userTeam.team[index].attack = character.attack;
        userTeam.team[index].defence = character.defence;
        userTeam.team[index].health = character.health;
        userTeam.team[index].level = character.level;
        userTeam.team[index].position = character.position;
      });
      const warTeam = new Team('war', 1, object.userTeam.team.length);
      object.warTeam.team.forEach((character, index) => {
        warTeam.team[index] = characterGenerator([character], 1).next().value;
        warTeam.team[index].attack = character.attack;
        warTeam.team[index].defence = character.defence;
        warTeam.team[index].health = character.health;
        warTeam.team[index].level = character.level;
        warTeam.team[index].position = character.position;
      });
      return {
        userTeam,
        warTeam,
        step: object.step,
        score: object.score,
        hiScore: object.hiScore,
        level: object.level,
      };
    }

    return {
      userTeam: positioning('user', new Team('user', 1, 2)),
      warTeam: positioning('war', new Team('war', 1, 2)),
      step: 0,
      score: 0,
      hiScore: 0,
      level: 1,
    };
  }
}
