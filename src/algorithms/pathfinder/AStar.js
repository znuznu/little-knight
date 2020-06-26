import Node from './Node.js';
import BinaryHeap from '../struct/BinaryHeap.js';

export default class AStar {
  /**
   * Represent a "factory" using the A-Star algorithm.
   *
   * The idea is to create a 2D-array based on the one given by the user
   * as well as a mandatory block testing function (what makes a square "block" ?).
   *
   * Then we can use them in order to find a shortest path between two given
   * coordinates with 4 directions and an optimal efficiency (using a Binary
   * Heap and (built-in) Maps whenever it is possible).
   *
   * The grid is created only once and can be used as much as we want.
   *
   * @constructor
   * @param {Object} config - Configuration object of the algorithm.
   * @param {Array} config.datas - A 2D-array of (non-)objects.
   * @param {function} config.block - True if this object is a block.
   */
  constructor(config) {
    this.block = config.block;
    this.grid = this.initGrid(config.datas);
    this.heuristic = this.manhattan;
  }

  /**
   * Initialize the A-Star grid used later for pathfinding.
   * Unblocked elements becomes Node and blocked elements becomes
   * undefined in this grid.
   *
   * @param {array} datas - A 2D-Array.
   */
  initGrid(datas) {
    let grid = [];

    for (let row = 0; row < datas.length; row++) {
      if (!grid[row])
        grid[row] = [];

      for (let col = 0; col < datas[0].length; col++) {
        let data = datas[row][col];

        if (!this.block(data)) {
          grid[row].push(new Node(row, col, data));
        } else {
          grid[row].push(undefined);
        }
      }
    }

    return grid;
  }

  /**
   * Initialize the neighbors from the given Node in 4 directions.
   *
   * @param {Node} node - A node with undefined neighbors.
   */
  initNeighbors(node) {
    node.neighbors = new Set([]);

    const adjacents = [
      {r: node.r + 1, c: node.c},
      {r: node.r - 1, c: node.c},
      {r: node.r, c: node.c + 1},
      {r: node.r, c: node.c - 1}
    ];

    adjacents.forEach(adjacent => {
      let neighbor = undefined;

      if (this.contains(adjacent.r, adjacent.c)) {
        neighbor = this.grid[adjacent.r][adjacent.c];
      }

      neighbor && node.neighbors.add(neighbor);
    });
  }

  /**
  * Check if the coordinates are within the bounds of the grid.
  *
  * @param {number} r - row coordinate of the Cell.
  * @param {number} c - col coordinate of the Cell.
  * @returns {boolean} - True if the coordinates within bounds.
  */
  contains(r, c) {
    let containsR = r >= 0 && r < this.grid.length;
    let containsC = c >= 0 && c < this.grid[0].length;

    return containsR && containsC;
  }

  /**
   * The Manhattan Distance between node1 & node2.
   *
   * @param {Node} node1 - First Node.
   * @param {Node} node2 - Second Node.
   */
  manhattan(node1, node2) {
    let dr = Math.abs(node2.r - node1.r);
    let dc = Math.abs(node2.c - node1.c);

    return dr + dc;
  }

  /**
   * Return one of the shortest path found between start and target.
   *
   * @param {Object} start - Coordinates of the starting Node.
   * @param {Object} target - Coordinates of the end/target Node.
   * @returns {Object} result - The results.
   * @returns {string} result.status - 'Found', 'None', 'Invalid', 'Block'.
   * @returns {Array} result.path - The Node coordinates of the path found, in
   * the order from `start` to `target`.
   */
  search(start, target) {
    let containsStart = this.contains(start.r, start.c);
    let containsTarget = this.contains(target.r, target.c);

    if (!(containsStart && containsTarget)) {
      return {status: 'Invalid'};
    }

    let startNode = this.grid[start.r][start.c];
    let targetNode = this.grid[target.r][target.c];

    if (!(startNode && targetNode)) {
      return {status: 'Block'};
    }

    let gScore = new Map(), fScore = new Map(), parents = new Map();
    gScore.set(startNode, 0);

    let f = gScore.get(startNode) + this.heuristic(startNode, targetNode);
    fScore.set(startNode, f);

    let close = new Set([]);
    let open = new BinaryHeap(node => fScore.get(node));

    open.push(startNode);

    while (open.datas.length) {
      let current = open.pop();

      // We have found the target.
      if (current === targetNode) {
        let path = [];
        let cursor = current;

        while (cursor !== startNode) {
          path.push({
            r: cursor.r,
            c: cursor.c
          });

          cursor = parents.get(cursor);
        }

        return {
          status: 'Found',
          path: path.reverse()
        };
      }

      if (!current.neighbors)
        this.initNeighbors(current);

      current.neighbors.forEach(neighbor => {
        if (!close.has(neighbor)) {
          gScore.set(neighbor, gScore.get(current) + 1);
          fScore.set(
            neighbor,
            gScore.get(neighbor) + this.heuristic(neighbor, targetNode)
          );
          open.push(neighbor);
        }

        if (!parents.has(neighbor) || fScore.get(parents.get(neighbor)) > fScore.get(current)) {
          parents.set(neighbor, current);
        }
      });

      if (!close.has(current)) {
        open.remove(current);
        close.add(current);
      }
    }

    return {status: 'None'};
  }
}
