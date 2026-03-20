import { MinHeap } from './MinHeap';

// ─── Types ───────────────────────────────────────────────────────────

interface Car {
  registrationNumber: string;
  colour: string;
}

export interface ParkResult {
  success: boolean;
  slot?: number;
  message: string;
}

export interface LeaveResult {
  success: boolean;
  slot?: number;
  message: string;
}

export interface StatusEntry {
  slot: number;
  registrationNumber: string;
  colour: string;
}

// ─── ParkingLot ──────────────────────────────────────────────────────
// Core domain class. Manages a 1-indexed array of slots and uses a
// min-heap to guarantee the nearest (lowest-numbered) available slot
// is always allocated first. Returns plain result objects — no I/O.

export class ParkingLot {
  private _capacity: number;
  private _slots: (Car | null)[];
  private _availableSlots: MinHeap;

  /**
   * Create a parking lot with the given number of slots.
   * @param capacity — total number of parking slots (1..n)
   */
  constructor(capacity: number) {
    this._capacity = capacity;
    // 1-indexed: index 0 is unused
    this._slots = new Array<Car | null>(capacity + 1).fill(null);
    // Seed the heap with slot numbers 1..n
    const slotNumbers: number[] = [];
    for (let i = 1; i <= capacity; i++) {
      slotNumbers.push(i);
    }
    this._availableSlots = new MinHeap(slotNumbers);
  }

  /**
   * Total number of slots.
   */
  get capacity(): number {
    return this._capacity;
  }

  /**
   * Park a car in the nearest available slot.
   */
  park(registrationNumber: string, colour: string): ParkResult {
    const slot = this._availableSlots.extractMin();
    if (slot === undefined) {
      return { success: false, message: 'Sorry, parking lot is full' };
    }
    this._slots[slot] = { registrationNumber, colour };
    return { success: true, slot, message: `Allocated slot number: ${slot}` };
  }

  /**
   * Free a parking slot.
   */
  leave(slotNumber: number): LeaveResult {
    if (slotNumber < 1 || slotNumber > this._capacity || !this._slots[slotNumber]) {
      return { success: false, message: `Slot number ${slotNumber} is already free` };
    }
    this._slots[slotNumber] = null;
    this._availableSlots.insert(slotNumber);
    return { success: true, slot: slotNumber, message: `Slot number ${slotNumber} is free` };
  }

  /**
   * Get all occupied slots.
   */
  status(): StatusEntry[] {
    const result: StatusEntry[] = [];
    for (let i = 1; i <= this._capacity; i++) {
      if (this._slots[i]) {
        result.push({
          slot: i,
          registrationNumber: this._slots[i]!.registrationNumber,
          colour: this._slots[i]!.colour
        });
      }
    }
    return result;
  }

  /**
   * Find registration numbers of all cars with the given colour.
   */
  registrationNumbersForCarsWithColour(colour: string): string[] {
    const lowerColour = colour.toLowerCase();
    const result: string[] = [];
    for (let i = 1; i <= this._capacity; i++) {
      if (this._slots[i] && this._slots[i]!.colour.toLowerCase() === lowerColour) {
        result.push(this._slots[i]!.registrationNumber);
      }
    }
    return result;
  }

  /**
   * Find slot numbers of all cars with the given colour.
   */
  slotNumbersForCarsWithColour(colour: string): number[] {
    const lowerColour = colour.toLowerCase();
    const result: number[] = [];
    for (let i = 1; i <= this._capacity; i++) {
      if (this._slots[i] && this._slots[i]!.colour.toLowerCase() === lowerColour) {
        result.push(i);
      }
    }
    return result;
  }

  /**
   * Find the slot number for a given registration number.
   */
  slotNumberForRegistrationNumber(registrationNumber: string): number | null {
    for (let i = 1; i <= this._capacity; i++) {
      if (this._slots[i] && this._slots[i]!.registrationNumber === registrationNumber) {
        return i;
      }
    }
    return null;
  }
}
