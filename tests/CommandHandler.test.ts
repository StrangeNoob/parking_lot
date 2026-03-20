import { CommandHandler } from '../src/CommandHandler';

describe('CommandHandler', () => {
  let handler: CommandHandler;

  beforeEach(() => {
    handler = new CommandHandler();
  });

  describe('create_parking_lot', () => {
    it('creates a parking lot and returns confirmation', () => {
      expect(handler.execute('create_parking_lot 6'))
        .toBe('Created a parking lot with 6 slots');
    });
  });

  describe('park', () => {
    beforeEach(() => {
      handler.execute('create_parking_lot 2');
    });

    it('parks a car and returns allocated slot', () => {
      expect(handler.execute('park KA-01-HH-1234 White'))
        .toBe('Allocated slot number: 1');
    });

    it('returns full message when lot is full', () => {
      handler.execute('park KA-01-HH-1234 White');
      handler.execute('park KA-01-HH-9999 Red');
      expect(handler.execute('park KA-01-BB-0001 Black'))
        .toBe('Sorry, parking lot is full');
    });
  });

  describe('leave', () => {
    beforeEach(() => {
      handler.execute('create_parking_lot 2');
      handler.execute('park KA-01-HH-1234 White');
    });

    it('frees a slot and returns confirmation', () => {
      expect(handler.execute('leave 1'))
        .toBe('Slot number 1 is free');
    });
  });

  describe('status', () => {
    beforeEach(() => {
      handler.execute('create_parking_lot 3');
      handler.execute('park KA-01-HH-1234 White');
      handler.execute('park KA-01-BB-0001 Black');
    });

    it('returns formatted status table', () => {
      const output = handler.execute('status')!;
      const lines = output.split('\n');
      expect(lines[0]).toBe('Slot No.    Registration No     Colour');
      expect(lines[1]).toBe('1           KA-01-HH-1234       White');
      expect(lines[2]).toBe('2           KA-01-BB-0001       Black');
    });
  });

  describe('registration_numbers_for_cars_with_colour', () => {
    beforeEach(() => {
      handler.execute('create_parking_lot 3');
      handler.execute('park KA-01-HH-1234 White');
      handler.execute('park KA-01-BB-0001 Black');
      handler.execute('park KA-01-HH-9999 White');
    });

    it('returns comma-separated registration numbers', () => {
      expect(handler.execute('registration_numbers_for_cars_with_colour White'))
        .toBe('KA-01-HH-1234, KA-01-HH-9999');
    });

    it('returns Not found when no match', () => {
      expect(handler.execute('registration_numbers_for_cars_with_colour Red'))
        .toBe('Not found');
    });
  });

  describe('slot_numbers_for_cars_with_colour', () => {
    beforeEach(() => {
      handler.execute('create_parking_lot 3');
      handler.execute('park KA-01-HH-1234 White');
      handler.execute('park KA-01-BB-0001 Black');
      handler.execute('park KA-01-HH-9999 White');
    });

    it('returns comma-separated slot numbers', () => {
      expect(handler.execute('slot_numbers_for_cars_with_colour White'))
        .toBe('1, 3');
    });

    it('returns Not found when no match', () => {
      expect(handler.execute('slot_numbers_for_cars_with_colour Red'))
        .toBe('Not found');
    });
  });

  describe('slot_number_for_registration_number', () => {
    beforeEach(() => {
      handler.execute('create_parking_lot 2');
      handler.execute('park KA-01-HH-1234 White');
      handler.execute('park KA-01-BB-0001 Black');
    });

    it('returns the slot number', () => {
      expect(handler.execute('slot_number_for_registration_number KA-01-BB-0001'))
        .toBe('2');
    });

    it('returns Not found for unknown registration', () => {
      expect(handler.execute('slot_number_for_registration_number UNKNOWN'))
        .toBe('Not found');
    });
  });

  describe('edge cases', () => {
    it('returns null for empty line', () => {
      expect(handler.execute('')).toBeNull();
    });

    it('returns null for exit command', () => {
      expect(handler.execute('exit')).toBeNull();
    });

    it('returns error for unknown command', () => {
      expect(handler.execute('do_something')).toBe('Unknown command: do_something');
    });
  });
});
