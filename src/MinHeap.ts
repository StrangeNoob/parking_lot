// ─── MinHeap ─────────────────────────────────────────────────────────
// Array-based binary min-heap.
// Guarantees the lowest-numbered available slot is always at the top.

export class MinHeap {
  private _heap: number[];

  /**
   * Create a MinHeap.
   * @param items — optional initial items (will be heapified)
   */
  constructor(items: number[] = []) {
    this._heap = [];
    for (const item of items) {
      this.insert(item);
    }
  }

  /**
   * Number of items in the heap.
   */
  get size(): number {
    return this._heap.length;
  }

  /**
   * Peek at the minimum value without removing it.
   */
  peek(): number | undefined {
    return this._heap[0];
  }

  /**
   * Insert a value into the heap.
   */
  insert(value: number): void {
    this._heap.push(value);
    this._bubbleUp(this._heap.length - 1);
  }

  /**
   * Remove and return the minimum value.
   */
  extractMin(): number | undefined {
    if (this._heap.length === 0) return undefined;
    if (this._heap.length === 1) return this._heap.pop();

    const min = this._heap[0];
    this._heap[0] = this._heap.pop()!;
    this._sinkDown(0);
    return min;
  }

  // ─── Private helpers ─────────────────────────────────────────────

  private _bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this._heap[parentIndex] <= this._heap[index]) break;
      [this._heap[parentIndex], this._heap[index]] = [this._heap[index], this._heap[parentIndex]];
      index = parentIndex;
    }
  }

  private _sinkDown(index: number): void {
    const length = this._heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this._heap[left] < this._heap[smallest]) {
        smallest = left;
      }
      if (right < length && this._heap[right] < this._heap[smallest]) {
        smallest = right;
      }
      if (smallest === index) break;

      [this._heap[smallest], this._heap[index]] = [this._heap[index], this._heap[smallest]];
      index = smallest;
    }
  }
}
