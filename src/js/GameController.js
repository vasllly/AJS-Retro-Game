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
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);

    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    const state = GameState.from(this.stateService.load());

    // Отрисовка персонажей
    const characters = [];
    state.userTeam.forEach((character) => {
      characters.push(new PositionedCharacter(character, character.position));
    });
    state.warTeam.forEach((character) => {
      characters.push(new PositionedCharacter(character, character.position));
    });
    this.gamePlay.redrawPositions(characters);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // const message = `${avatars[object.type] ? avatars[object.type] : ''}
    // ${object.name.charAt(0)}(${object.level}) \u{2694}${object.attack}
    // \u{1F6E1}${object.defence} \u{2764}${object.health}`;
    if (this.cells[index].innerHTML !== '') {
      this.showCellTooltip('Hi', index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.cells[index].innerHTML !== '') {
      this.hideCellTooltip(index);
    }
  }
}
