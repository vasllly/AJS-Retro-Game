/* eslint-disable no-param-reassign */
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
import Team from './Team';
import { generateTeam, positioning } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.levels = ['', 'prairie', 'desert', 'arctic', 'mountain'];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));

    // TODO: load saved stated from stateService
    this.loadGame();
  }

  newGame() {
    // TODO: load saved stated from stateService
    const { hiScore } = this.state;
    this.state = GameState.from();
    this.state.hiScore = hiScore;

    // Отрисовка поля
    this.gamePlay.drawUi(themes.prairie);

    // Отрисовка персонажей
    this.redrawPositions();
  }

  saveGame() {
    this.stateService.save(this.state);
  }

  loadGame() {
    this.state = GameState.from(this.stateService.load());

    // Отрисовка поля
    this.gamePlay.drawUi(this.levels[this.state.level]);

    // Отрисовка персонажей
    this.redrawPositions();
  }

  onCellClick(index) {
    // TODO: react to click
    // Проверка, что сейчас наш ход
    if (this.block) return;

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
    if (this.block) return;

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
    if (this.block) return;

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
    this.state.userTeam.filter();
    this.state.warTeam.filter();

    // Закончен ли уровень?
    if (this.state.warTeam.count() === 0) this.nextLevel();
    if (this.state.userTeam.count() === 0) this.gameOver();

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
    this.block = true;
    // eslint-disable-next-line prefer-destructuring
    this.selectCharacter = [...this.state.warTeam][0];
    this.gamePlay.selectCell(this.selectCharacter.position);
    const characterUser = [...this.state.userTeam][0];
    if (canAttack(this.selectCharacter, characterUser.position)) {
      this.gamePlay.selectCell(characterUser.position, 'red');
      this.attacked(characterUser.position);
    } else {
      const userСoordinates = getXY(characterUser.position);
      let target = userСoordinates[0] + userСoordinates[1] * 8 + 1;
      let vector = 1;
      let step = 1;
      let i = 0;
      // eslint-disable-next-line max-len
      while (!canWalk(this.selectCharacter, target) || this.targetChar(target) || userСoordinates[0] > 7 || userСoordinates[0] < 0 || userСoordinates[1] > 7 || userСoordinates[1] < 0) {
        if (i < step) {
          switch (vector % 4) {
            case 0:
              userСoordinates[0] += 1;
              break;
            case 1:
              userСoordinates[1] += 1;
              break;
            case 2:
              userСoordinates[0] -= 1;
              break;
            case 3:
              userСoordinates[1] -= 1;
              break;
            default:
              break;
          }
          i += 1;
          target = userСoordinates[0] + userСoordinates[1] * 8;
        } else {
          step += 1;
          vector += 1;
          i = 0;
        }
        console.log(getXY(target));
      }
      this.moved(target);
    }
    this.block = false;
  }

  nextLevel() {
    if (this.state.level === 4) {
      // this.gameOver('win');
      this.state.level = 3;
      this.nextLevel();
    } else {
      [...this.state.userTeam].forEach((character) => {
        // Начисление очков
        this.state.score += character.health;

        // level up выживших персонажей
        character.level += 1;
        character.health = Math.min(character.health + 80, 100);
        const attackAfter = character.attack * (1.8 - character.health / 100);
        character.attack = Math.max(character.attack, attackAfter);
        const defenceAfter = character.defence * (1.8 - character.health / 100);
        character.defence = Math.max(character.defence, defenceAfter);
      });

      // генерация дополнительных персонажей пользователя
      const userTypes = [
        { type: 'swordsman' },
        { type: 'bowman' },
        { type: 'magician' },
      ];
      const countNewUsers = Math.min(this.state.level, 2);
      const newMembers = generateTeam(userTypes, this.state.level, countNewUsers);
      this.state.userTeam.team = [...this.state.userTeam.team, ...newMembers];
      this.state.userTeam = positioning('user', this.state.userTeam);

      // Переход на следующий уровень
      this.state.level += 1;

      // Генерация новой вражеской команды
      this.state.warTeam = positioning('war', new Team('war', this.state.level, this.state.userTeam.count()));

      // Отрисовка следующего уровня
      this.gamePlay.drawUi(themes[this.levels[this.state.level]]);

      // Обнуление шагов
      this.state.step = 0;
    }
  }

  gameOver(status) {
    this.state.step = 1;
    if (this.state.score > this.state.hiScore) this.state.hiScore = this.state.score;
    if (status === 'win') {
      GamePlay.showMessage(`You win! Your score: ${this.state.score}`);
    } else {
      GamePlay.showMessage(`You loss! Your score: ${this.state.score}`);
    }
  }
}
