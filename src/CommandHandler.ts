import { ParkingLot } from './ParkingLot';

// ─── CommandHandler ──────────────────────────────────────────────────
// Stateful parser/dispatcher. Translates text commands into ParkingLot
// method calls and formats output strings. Owns no I/O itself.

export class CommandHandler {
  private _parkingLot: ParkingLot | null;

  constructor() {
    this._parkingLot = null;
  }

  /**
   * Parse and execute a single command line.
   * @param line — raw command string
   * @returns formatted output, or null for exit/empty
   */
  execute(line: string): string | null {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const parts = trimmed.split(/\s+/);
    const command = parts[0];

    switch (command) {
      case 'create_parking_lot':
        return this._createParkingLot(parseInt(parts[1], 10));

      case 'park':
        return this._park(parts[1], parts[2]);

      case 'leave':
        return this._leave(parseInt(parts[1], 10));

      case 'status':
        return this._status();

      case 'registration_numbers_for_cars_with_colour':
        return this._registrationNumbersForCarsWithColour(parts[1]);

      case 'slot_numbers_for_cars_with_colour':
        return this._slotNumbersForCarsWithColour(parts[1]);

      case 'slot_number_for_registration_number':
        return this._slotNumberForRegistrationNumber(parts[1]);

      case 'exit':
        return null;

      default:
        return `Unknown command: ${command}`;
    }
  }

  // ─── Private formatters ──────────────────────────────────────────

  private _createParkingLot(capacity: number): string {
    this._parkingLot = new ParkingLot(capacity);
    return `Created a parking lot with ${capacity} slots`;
  }

  private _park(registrationNumber: string, colour: string): string {
    const result = this._parkingLot!.park(registrationNumber, colour);
    return result.message;
  }

  private _leave(slotNumber: number): string {
    const result = this._parkingLot!.leave(slotNumber);
    return result.message;
  }

  private _status(): string {
    const entries = this._parkingLot!.status();
    const header = 'Slot No.'.padEnd(12) + 'Registration No'.padEnd(20) + 'Colour';
    const rows = entries.map(
      (e) => String(e.slot).padEnd(12) + e.registrationNumber.padEnd(20) + e.colour
    );
    return [header, ...rows].join('\n');
  }

  private _registrationNumbersForCarsWithColour(colour: string): string {
    const numbers = this._parkingLot!.registrationNumbersForCarsWithColour(colour);
    return numbers.length > 0 ? numbers.join(', ') : 'Not found';
  }

  private _slotNumbersForCarsWithColour(colour: string): string {
    const slots = this._parkingLot!.slotNumbersForCarsWithColour(colour);
    return slots.length > 0 ? slots.join(', ') : 'Not found';
  }

  private _slotNumberForRegistrationNumber(registrationNumber: string): string {
    const slot = this._parkingLot!.slotNumberForRegistrationNumber(registrationNumber);
    return slot !== null ? String(slot) : 'Not found';
  }
}
