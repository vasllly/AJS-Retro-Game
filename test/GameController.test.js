import GameController from '../src/js/GameController';
import Bowman from '../src/js/characters/Bowman';

test('test generateMessage for Bowman', () => {
  const character = new Bowman(1);
  const controller = new GameController({}, {});
  const received = controller.generateMessage(character);
  const expected = '🎖1 ⚔25 🛡25 ❤100';
  expect(received).toBe(expected);
});
