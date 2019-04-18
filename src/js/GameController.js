/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    this.state = GameState.from(this.stateService.load());

    // Отрисовка персонажей
    this.allCharacters = [...this.state.userTeam, ...this.state.warTeam];
    const positions = [];
    this.allCharacters.forEach((character) => {
      positions.push(new PositionedCharacter(character, character.position));
    });
    this.gamePlay.redrawPositions(positions);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.cells[index].innerHTML !== '') {
      const targetChar = this.allCharacters.filter(character => character.position === index)[0];
      this.gamePlay.showCellTooltip(this.generateMessage(targetChar), index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.gamePlay.cells[index].innerHTML !== '') {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  generateMessage(character) {
    return `\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`;
  }
}
