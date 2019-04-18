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
    this.redrawPositions();
  }

  onCellClick(index) {
    // TODO: react to click
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    // Выбор персонажа
    if (this.gamePlay.cells[index].innerHTML !== '') {
      const targetChar = this.targetChar(index);
      if (['bowman', 'swordsman', 'magician'].includes(targetChar.type)) {
        if (this.selectCharacter) this.gamePlay.deselectCell(this.selectCharacter.position);
        this.gamePlay.selectCell(index);
        this.selectCharacter = targetChar;
      // Атака
      } else if (canAttack(this.selectCharacter, index)) {
        this.attacked(index);
      } else {
        GamePlay.showError('Нельзя выбрать персонажа противника!');
      }
    // Перемещение
    } else if (canWalk(this.selectCharacter, index)) {
      this.moved(index);
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    if (this.gamePlay.cells[index].innerHTML !== '') {
      const targetChar = this.targetChar(index);

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
      const targetChar = this.targetChar(index);
      if (['undead', 'daemon', 'vampire'].includes(targetChar.type)) this.gamePlay.deselectCell(index);
    } else this.gamePlay.deselectCell(index);
  }

  targetChar(index) {
    const allCharacters = [...this.state.userTeam, ...this.state.warTeam];
    return allCharacters.filter(character => character.position === index)[0];
  }

  redrawPositions() {
    const positions = [];
    [...this.state.userTeam, ...this.state.warTeam].forEach((character) => {
      positions.push(new PositionedCharacter(character, character.position));
    });
    this.gamePlay.redrawPositions(positions);
  }

  moved(index) {
    // this.state.step += 1;
    const oldPosition = this.selectCharacter.position;
    this.selectCharacter.position = index;
    this.redrawPositions();
    this.gamePlay.deselectCell(index);
    this.gamePlay.deselectCell(oldPosition);
    this.selectCharacter = undefined;
  }

  async attacked(index) {
    // Переход на следующий шаг
    // this.state.step += 1;
    this.gamePlay.deselectCell(index);
    this.gamePlay.deselectCell(this.selectCharacter.position);

    // Расчет атаки
    const target = this.targetChar(index);
    const { attack } = this.selectCharacter;
    const damage = Math.max(attack - target.defence, attack * 0.1);
    this.selectCharacter = undefined;

    // Атака
    await this.gamePlay.showDamage(index, damage).then();
    target.health -= damage;

    // Отрисовка
    this.redrawPositions();
  }
}
