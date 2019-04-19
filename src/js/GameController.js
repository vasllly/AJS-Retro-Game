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
  getXY,
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

  allCharacters() {
    return [...this.state.userTeam, ...this.state.warTeam];
  }

  targetChar(index) {
    return this.allCharacters().filter(character => character.position === index)[0];
  }

  redrawPositions() {
    const positions = [];
    this.allCharacters().forEach((character) => {
      positions.push(new PositionedCharacter(character, character.position));
    });
    this.gamePlay.redrawPositions(positions);

    // Ответные действия компьютера
    if (this.state.step % 2 === 1) this.computerResponse();
  }

  endStep(position, target) {
    this.state.step += 1;
    this.gamePlay.deselectCell(position);
    this.gamePlay.deselectCell(target);
    this.gamePlay.setCursor(cursors.auto);
    this.selectCharacter = undefined;

    // Удаление мертвых персонажей
    this.state.userTeam = [...this.state.userTeam].filter(character => character.health > 0);
    this.state.warTeam = [...this.state.warTeam].filter(character => character.health > 0);

    if ([...this.state.warTeam].length === 0) {
      this.state.step = 0;
      alert('You win!');
    }

    if ([...this.state.userTeam].length === 0) {
      this.state.step = 1;
      alert('Game over!');
    }

    // Отрисовка персонажей
    this.redrawPositions();
  }

  moved(index) {
    // Сохранение старой позиции для очистки ячейки
    const oldPosition = this.selectCharacter.position;

    // Перемещение
    this.selectCharacter.position = index;

    // Завершение хода
    this.endStep(oldPosition, index);
  }

  async attacked(index) {
    // Расчет атаки
    const target = this.targetChar(index);
    const { attack, position } = this.selectCharacter;
    const damage = Math.max(attack - target.defence, attack * 0.1);

    // Атака
    await this.gamePlay.showDamage(index, damage).then();
    target.health -= damage;

    // Завершение хода
    this.endStep(position, index);
  }

  computerResponse() {
    // eslint-disable-next-line prefer-destructuring
    this.selectCharacter = [...this.state.warTeam][0];
    this.gamePlay.selectCell(this.selectCharacter.position);
    const characterUser = [...this.state.userTeam][0];
    if (canAttack(this.selectCharacter, characterUser.position)) {
      this.gamePlay.selectCell(characterUser.position, 'red');
      this.attacked(characterUser.position);
    } else {
      const warСoordinates = getXY(this.selectCharacter.position);
      const userСoordinates = getXY(characterUser.position);
      const dx = warСoordinates[0] - userСoordinates[0];
      const dy = warСoordinates[1] - userСoordinates[1];
      if (Math.abs(dx) <= 1 && Math.abs(dy) > 1) {
        warСoordinates[1] -= Math.min(Math.abs(dy), this.selectCharacter.speed) * dy / Math.abs(dy);
        if (warСoordinates[1] === userСoordinates[1] && dx === 0) {
          warСoordinates[1] += dy / Math.abs(dy);
        }
      }
      if (Math.abs(dy) <= 1 && Math.abs(dx) > 1) {
        warСoordinates[0] -= Math.min(Math.abs(dx), this.selectCharacter.speed) * dx / Math.abs(dx);
        if (warСoordinates[0] === userСoordinates[0] && dy === 0) {
          warСoordinates[0] += dx / Math.abs(dx);
        }
      }
      if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
        const maxStep = Math.min(Math.abs(dx), Math.abs(dy), this.selectCharacter.speed);
        if (maxStep === this.selectCharacter.speed) {
          warСoordinates[0] -= maxStep * dx / Math.abs(dx);
          warСoordinates[1] -= maxStep * dy / Math.abs(dy);
        } else if (Math.abs(dx) > Math.abs(dy)) {
          warСoordinates[0] -= dy * dx / Math.abs(dx);
          warСoordinates[1] -= dy * dy / Math.abs(dy);
        } else {
          warСoordinates[0] -= dx * dx / Math.abs(dx);
          warСoordinates[1] -= dx * dy / Math.abs(dy);
        }
        if (warСoordinates[0] === userСoordinates[0] && warСoordinates[1] === userСoordinates[1]) {
          warСoordinates[0] += dx / Math.abs(dx);
          warСoordinates[1] += dy / Math.abs(dy);
        }
      }
      const target = warСoordinates[0] + warСoordinates[1] * 8;
      this.moved(target);
    }
  }
}
