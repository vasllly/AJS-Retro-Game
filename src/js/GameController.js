import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import {
  generateMessage,
  canWalk,
  canAttack,
  changeСursor,
  changeCell,
} from './utils';


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
    this.state = GameState.from(this.stateService.load());

    // Отрисовка поля
    this.gamePlay.drawUi(themes.prairie);

    // Отрисовка персонажей
    this.redrawPositions();
  }

  onCellClick(index) {
    // TODO: react to click
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    // Инициируем персонажа
    const targetChar = this.targetChar(index);

    if (targetChar) {
      // Выбор персонажа
      if (['bowman', 'swordsman', 'magician'].includes(targetChar.type)) {
        if (this.selectCharacter) this.gamePlay.deselectCell(this.selectCharacter.position);
        this.gamePlay.selectCell(index);
        this.selectCharacter = targetChar;
      // Атака
      } else if (canAttack(this.selectCharacter, index)) {
        this.attacked(index);
      // Нельзя выбрать вражеского персонажа
      } else {
        GamePlay.showError('Нельзя выбрать персонажа противника!');
      }
    // Перемещение
    } else if (canWalk(this.selectCharacter, index)) this.moved(index);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    // Инициируем персонажа
    const targetChar = this.targetChar(index);

    // Вывод информации о персонаже
    if (targetChar) this.gamePlay.showCellTooltip(generateMessage(targetChar), index);

    // Визуальный отклик курсора
    const cursorType = changeСursor(this.selectCharacter, index, targetChar);
    this.gamePlay.setCursor(cursors[cursorType]);

    // Визуальный отклик ячейки
    const cellType = changeCell(this.selectCharacter, index, targetChar);
    if (cellType) this.gamePlay.selectCell(index, cellType);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    // Проверка, что сейчас наш ход
    if (this.state.step % 2 === 1) return;

    // Инициируем персонажа
    const targetChar = this.targetChar(index);

    // Скрываем информацию о персонаже
    if (targetChar) this.gamePlay.hideCellTooltip(index);

    // Визуальный отклик ячейки
    if (this.selectCharacter !== targetChar) this.gamePlay.deselectCell(index);
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
    // Переход на следующий шаг
    this.state.step += 1;

    // Сохранение старой позиции для очистки ячейки
    const oldPosition = this.selectCharacter.position;

    // Перемещение
    this.selectCharacter.position = index;

    // Отрисовка
    this.redrawPositions();
    this.gamePlay.deselectCell(index);
    this.gamePlay.deselectCell(oldPosition);
    this.gamePlay.setCursor(cursors.auto);
    this.selectCharacter = undefined;
  }

  async attacked(index) {
    // Переход на следующий шаг
    this.state.step += 1;

    // Расчет атаки
    const target = this.targetChar(index);
    const { attack } = this.selectCharacter;
    const damage = Math.max(attack - target.defence, attack * 0.1);

    // Атака
    await this.gamePlay.showDamage(index, damage).then();
    target.health -= damage;

    // Отрисовка
    this.gamePlay.deselectCell(index);
    this.gamePlay.deselectCell(this.selectCharacter.position);
    this.gamePlay.setCursor(cursors.auto);
    this.selectCharacter = undefined;
    this.redrawPositions();
  }
}
