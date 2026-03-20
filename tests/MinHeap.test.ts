import { MinHeap } from '../src/MinHeap';

describe('MinHeap', () => {
  describe('constructor', () => {
    it('creates an empty heap by default', () => {
      const heap = new MinHeap();
      expect(heap.size).toBe(0);
      expect(heap.peek()).toBeUndefined();
    });

    it('heapifies initial items', () => {
      const heap = new MinHeap([5, 3, 1, 4, 2]);
      expect(heap.size).toBe(5);
      expect(heap.peek()).toBe(1);
    });
  });

  describe('insert', () => {
    it('inserts a single value', () => {
      const heap = new MinHeap();
      heap.insert(42);
      expect(heap.size).toBe(1);
      expect(heap.peek()).toBe(42);
    });

    it('maintains min at the top after multiple inserts', () => {
      const heap = new MinHeap();
      heap.insert(10);
      heap.insert(5);
      heap.insert(20);
      expect(heap.peek()).toBe(5);
    });
  });

  describe('extractMin', () => {
    it('returns undefined on empty heap', () => {
      const heap = new MinHeap();
      expect(heap.extractMin()).toBeUndefined();
    });

    it('extracts the single element', () => {
      const heap = new MinHeap([7]);
      expect(heap.extractMin()).toBe(7);
      expect(heap.size).toBe(0);
    });

    it('extracts elements in sorted order', () => {
      const heap = new MinHeap([5, 3, 1, 4, 2]);
      const sorted: number[] = [];
      while (heap.size > 0) {
        sorted.push(heap.extractMin()!);
      }
      expect(sorted).toEqual([1, 2, 3, 4, 5]);
    });

    it('works correctly after mixed insert and extract', () => {
      const heap = new MinHeap();
      heap.insert(10);
      heap.insert(4);
      expect(heap.extractMin()).toBe(4);
      heap.insert(2);
      heap.insert(8);
      expect(heap.extractMin()).toBe(2);
      expect(heap.extractMin()).toBe(8);
      expect(heap.extractMin()).toBe(10);
      expect(heap.extractMin()).toBeUndefined();
    });
  });

  describe('size', () => {
    it('tracks size through inserts and extracts', () => {
      const heap = new MinHeap();
      expect(heap.size).toBe(0);
      heap.insert(1);
      expect(heap.size).toBe(1);
      heap.insert(2);
      expect(heap.size).toBe(2);
      heap.extractMin();
      expect(heap.size).toBe(1);
    });
  });
});
