/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import { positionsGenerator, generateTeam } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(themes.prairie);

    // Создание команды игрока
    const startTypes = [
      { type: 'swordsman' },
      { type: 'bowman' },
    ];
    const userTeam = generateTeam(startTypes, 1, 2);
    const userTeamPositions = positionsGenerator(0, 2, 2);

    // Создание команды противника
    const warTypes = [
      { type: 'daemon' },
      { type: 'undead' },
      { type: 'vampire' },
    ];
    const warTeam = generateTeam(warTypes, 1, 2);
    const warTeamPositions = positionsGenerator(6, 8, 2);

    // Отрисовка персонажей
    this.gamePlay.redrawPositions([
      new PositionedCharacter(userTeam[0], userTeamPositions[0]),
      new PositionedCharacter(userTeam[1], userTeamPositions[1]),
      new PositionedCharacter(warTeam[0], warTeamPositions[0]),
      new PositionedCharacter(warTeam[1], warTeamPositions[1]),
    ]);
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
