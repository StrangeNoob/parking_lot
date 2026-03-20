import { ParkingLot } from '../src/ParkingLot';

describe('ParkingLot', () => {
  let lot: ParkingLot;

  beforeEach(() => {
    lot = new ParkingLot(3);
  });

  describe('constructor', () => {
    it('creates a lot with the given capacity', () => {
      expect(lot.capacity).toBe(3);
    });
  });

  describe('park', () => {
    it('allocates the nearest available slot', () => {
      const result = lot.park('KA-01-HH-1234', 'White');
      expect(result).toEqual({
        success: true,
        slot: 1,
        message: 'Allocated slot number: 1'
      });
    });

    it('allocates slots in order', () => {
      lot.park('KA-01-HH-1234', 'White');
      const result = lot.park('KA-01-HH-9999', 'Red');
      expect(result.slot).toBe(2);
    });

    it('returns full message when no slots available', () => {
      lot.park('A', 'White');
      lot.park('B', 'White');
      lot.park('C', 'White');
      const result = lot.park('D', 'White');
      expect(result).toEqual({
        success: false,
        message: 'Sorry, parking lot is full'
      });
    });
  });

  describe('leave', () => {
    it('frees an occupied slot', () => {
      lot.park('KA-01-HH-1234', 'White');
      const result = lot.leave(1);
      expect(result).toEqual({
        success: true,
        slot: 1,
        message: 'Slot number 1 is free'
      });
    });

    it('returns error for already free slot', () => {
      const result = lot.leave(1);
      expect(result.success).toBe(false);
    });

    it('makes the freed slot available for nearest-slot allocation', () => {
      lot.park('A', 'White');
      lot.park('B', 'White');
      lot.park('C', 'White');
      lot.leave(1);
      lot.leave(3);
      // Slot 1 should be allocated before slot 3
      const result = lot.park('D', 'Red');
      expect(result.slot).toBe(1);
      const result2 = lot.park('E', 'Blue');
      expect(result2.slot).toBe(3);
    });
  });

  describe('status', () => {
    it('returns empty array for empty lot', () => {
      expect(lot.status()).toEqual([]);
    });

    it('returns occupied slots in order', () => {
      lot.park('KA-01-HH-1234', 'White');
      lot.park('KA-01-BB-0001', 'Black');
      expect(lot.status()).toEqual([
        { slot: 1, registrationNumber: 'KA-01-HH-1234', colour: 'White' },
        { slot: 2, registrationNumber: 'KA-01-BB-0001', colour: 'Black' }
      ]);
    });

    it('excludes vacated slots', () => {
      lot.park('KA-01-HH-1234', 'White');
      lot.park('KA-01-BB-0001', 'Black');
      lot.leave(1);
      expect(lot.status()).toEqual([
        { slot: 2, registrationNumber: 'KA-01-BB-0001', colour: 'Black' }
      ]);
    });
  });

  describe('registrationNumbersForCarsWithColour', () => {
    it('returns matching registration numbers', () => {
      lot.park('KA-01-HH-1234', 'White');
      lot.park('KA-01-BB-0001', 'Black');
      lot.park('KA-01-HH-9999', 'White');
      expect(lot.registrationNumbersForCarsWithColour('White'))
        .toEqual(['KA-01-HH-1234', 'KA-01-HH-9999']);
    });

    it('returns empty array when no match', () => {
      lot.park('KA-01-HH-1234', 'White');
      expect(lot.registrationNumbersForCarsWithColour('Red')).toEqual([]);
    });

    it('performs case-insensitive colour matching', () => {
      lot.park('KA-01-HH-1234', 'White');
      expect(lot.registrationNumbersForCarsWithColour('white'))
        .toEqual(['KA-01-HH-1234']);
    });
  });

  describe('slotNumbersForCarsWithColour', () => {
    it('returns matching slot numbers', () => {
      lot.park('KA-01-HH-1234', 'White');
      lot.park('KA-01-BB-0001', 'Black');
      lot.park('KA-01-HH-9999', 'White');
      expect(lot.slotNumbersForCarsWithColour('White')).toEqual([1, 3]);
    });

    it('returns empty array when no match', () => {
      expect(lot.slotNumbersForCarsWithColour('Red')).toEqual([]);
    });
  });

  describe('slotNumberForRegistrationNumber', () => {
    it('returns the slot number for a parked car', () => {
      lot.park('KA-01-HH-1234', 'White');
      lot.park('KA-01-BB-0001', 'Black');
      expect(lot.slotNumberForRegistrationNumber('KA-01-BB-0001')).toBe(2);
    });

    it('returns null when not found', () => {
      expect(lot.slotNumberForRegistrationNumber('UNKNOWN')).toBeNull();
    });
  });
});
