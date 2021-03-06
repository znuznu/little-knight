export default class MinBinaryHeap {
  /**
   * Represent a (Min) Binary Heap.
   * Inspired by the Eloquent JavaScript book.
   *
   * @constructor
   * @param {function} scoreFunction - The function used to insert data
   */
  constructor(scoreFunction) {
    this.datas = [];
    this.datasSet = new Set([]);
    this.scoreFunction = scoreFunction;
  }

  /**
   * Return the size of this BinaryHeap.
   */
  size() {
    return this.datas.length;
  }

  /**
   * Insert an element into this BinaryHeap.
   *
   * @param {*} element - The element to insert
   */
  push(element) {
    this.datas.push(element);
    this.ascend(this.datas.length - 1);
    this.datasSet.add(element);
  }

  /**
   * Remove and return the smallest element of this BinaryHeap that is updated.
   */
  pop() {
    var result = this.datas[0];

    var end = this.datas.pop();

    if (this.datas.length > 0) {
      this.datas[0] = end;
      this.descend(0);
    }

    this.datasSet.delete(result);

    return result;
  }

  /**
   * Remove the node given from this BinaryHeap that is updated.
   * @param {*} element - The node to remove
   *
   */
  remove(node) {
    if (this.datasSet.has(node))
      this.datasSet.delete(node);

    var length = this.datas.length;

    for (var i = 0; i < length; i++) {
      if (this.datas[i] != node)
        continue;

      var end = this.datas.pop();

      if (i == length - 1)
        break;

      this.datas[i] = end;
      this.ascend(i);
      this.descend(i);

      break;
    }
  }

  /**
   * Move up the element with index n of this BinaryHeap.
   *
   * @param{int} n - The nth element
   */
  ascend(n) {
    var element = this.datas[n];
    var score = this.scoreFunction(element);

    while (n > 0) {
      var parentN = ~~((n + 1) / 2) - 1,
      parent = this.datas[parentN];

      if (score >= this.scoreFunction(parent))
        break;

      this.datas[parentN] = element;
      this.datas[n] = parent;
      n = parentN;
    }
  }

  /**
   * Move down the element with index n of this BinaryHeap.
   *
   * @param{int} n - The nth element
   */
  descend(n) {
   var length = this.datas.length,
   element = this.datas[n],
   elemScore = this.scoreFunction(element);

   while(true) {
     let c2 = (n + 1) * 2, c1 = c2 - 1;
     let swap = null;

     if (c1 < length) {
       let child1 = this.datas[c1];
       var child1Score = this.scoreFunction(child1);
       if (child1Score < elemScore)
         swap = c1;
     }

     if (c2 < length) {
       let child2 = this.datas[c2];
       let child2Score = this.scoreFunction(child2);
       if (child2Score < (swap == null ? elemScore : child1Score))
         swap = c2;
     }

     if (swap == null)
      break;

     this.datas[n] = this.datas[swap];
     this.datas[swap] = element;
     n = swap;
   }
  }

  /**
   * Check whether this node exists in the heap.
   *
   * @param {*} node - The node to check
   * @returns True if the node exists in the Heap
   */
  contains(node) {
      return this.datasSet.has(node);
  }
}
