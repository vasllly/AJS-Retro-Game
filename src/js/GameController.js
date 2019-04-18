import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import { generateMessage, canWalk, canAttack } from './utils';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    this.state = GameState.from(this.stateService.load());

    // Отрисовка персонажей
    this.allCharacters = [...this.state.userTeam, ...this.state.warTeam];
    this.redrawPositions();
  }

  onCellClick(index) {
    // TODO: react to click
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    // Выбор персонажа
    if (this.gamePlay.cells[index].innerHTML !== '') {
      const targetChar = this.allCharacters.filter(character => character.position === index)[0];
      if (['bowman', 'swordsman', 'magician'].includes(targetChar.type)) {
        if (this.selectCharacter) this.gamePlay.deselectCell(this.selectCharacter.position);
        this.gamePlay.selectCell(index);
        this.selectCharacter = targetChar;
      } else {
        GamePlay.showError('Нельзя выбрать персонажа противника!');
      }
    // Перемещение
    } else if (canWalk(this.selectCharacter, index)) {
      const oldPosition = this.selectCharacter.position;
      this.selectCharacter.position = index;
      this.redrawPositions();
      this.gamePlay.deselectCell(index);
      this.gamePlay.deselectCell(oldPosition);
      this.selectCharacter = undefined;
      this.state.step += 1;
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    if (this.gamePlay.cells[index].innerHTML !== '') {
      const targetChar = this.allCharacters.filter(character => character.position === index)[0];

      // Вывод информации о персонаже
      this.gamePlay.showCellTooltip(generateMessage(targetChar), index);

      // Визуальный отклик
      if (['bowman', 'swordsman', 'magician'].includes(targetChar.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (!this.selectCharacter) {
        this.gamePlay.setCursor(cursors.notallowed);
      } else if (canAttack(this.selectCharacter, index)) {
        this.gamePlay.selectCell(index, 'red');
      }
    } else if (canWalk(this.selectCharacter, index)) {
      this.gamePlay.selectCell(index, 'green');
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    if (this.gamePlay.cells[index].innerHTML !== '') {
      // Скрываем информацию о персонаже
      this.gamePlay.hideCellTooltip(index);

      // Визуальный отклик
      this.gamePlay.setCursor(cursors.auto);
      const targetChar = this.allCharacters.filter(character => character.position === index)[0];
      if (['undead', 'daemon', 'vampire'].includes(targetChar.type)) this.gamePlay.deselectCell(index);
    } else this.gamePlay.deselectCell(index);
  }

  redrawPositions() {
    const positions = [];
    this.allCharacters.forEach((character) => {
      positions.push(new PositionedCharacter(character, character.position));
    });
    this.gamePlay.redrawPositions(positions);
  }
}
