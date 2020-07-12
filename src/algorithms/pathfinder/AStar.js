import { D, D2, ORTHOG, DIAG } from './constants.js';
import Node from './Node.js';
import MinBinaryHeap from './struct/MinBinaryHeap.js';

export default class AStar {
  /**
   * Represent a "factory" using the A-Star algorithm.
   *
   * The idea is to create a 2D-array based on the one given by the user
   * as well as a mandatory block testing function (what makes an element
   * of this Array a "block" ?).
   *
   * Then we can use them in order to find a shortest path with 4 or 8 directions
   * between two given coordinates and an optimal efficiency (using a Binary
   * Heap and (built-in) Maps whenever it is possible).
   *
   * The grid is created only once and can be used as much as we want.
   *
   * @constructor
   * @param {Object} config - Configuration object of the algorithm
   * @param {Array} config.datas - A 2D-array of (non-)objects
   * @param {function} config.block - True if this object is a block
   * @param {number} config.topology - The topology, either 4 or 8
   */
  constructor(config) {
    this.block = config.block;
    this.grid = this.initGrid(config.datas);
    this.topology = config.topology || 4;
  }

  /**
   * Initialize the A-Star grid used later for pathfinding.
   * Unblocked elements becomes Node and blocked elements becomes
   * undefined in this grid.
   *
   * @param {array} datas - A 2D-Array
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
   * @param {Node} node - A node with undefined neighbors
   */
  initNeighbors(node) {
    node.neighbors = [];

    let getNeighbors = (n, directions, topology) => {
      directions.forEach(dir => {
        let nr = n.r + dir[0];
        let nc = n.c + dir[1];

        if (this.isValid(nr, nc)) {
          n.neighbors.push({
            node: this.grid[nr][nc],
            topology: topology
          });
        }
      });
    };

    getNeighbors(node, ORTHOG, 4);

    if (this.topology === 8)
      getNeighbors(node, DIAG, 8);
  }

  /**
  * Check if the coordinates are within the bounds of the grid.
  *
  * @param {number} r - row coordinate of the Node
  * @param {number} c - col coordinate of the Node
  * @returns {boolean} - True if the coordinates is within bounds
  */
  contains(r, c) {
    let containsR = r >= 0 && r < this.grid.length;
    let containsC = c >= 0 && c < this.grid[0].length;

    return containsR && containsC;
  }

  /**
   * Check if the Node exists in the grid and isn't a block.
   *
   * @param r - row coordinates of the Node to check
   * @param c - column coordinates of the Node to check
   * @returns True if the Node is valid
   */
  isValid(r, c) {
    if (!this.contains(r, c)) return false;

    return this.grid[r][c];
  }

  /**
   * Return one of the shortest path found between start and target.
   *
   * @param {Object} start - Coordinates of the starting Node
   * @param {Object} target - Coordinates of the end/target Node
   * @returns {Object} result - The results
   * @returns {string} result.status - 'Found', 'None', 'Invalid', 'Block'
   * @returns {Array} result.path - The Node coordinates of the path found, in
   * the order from `start` to `target`
   */
  search(start, target) {
    let containsStart = this.contains(start.r, start.c);
    let containsTarget = this.contains(target.r, target.c);

    if (!containsStart || !containsTarget) {
      return { status: 'Invalid' };
    }

    let startNode = this.grid[start.r][start.c];
    let targetNode = this.grid[target.r][target.c];

    let startNodeBlock = this.block(startNode.data);
    let targetNodeBlock = this.block(targetNode.data);

    if (startNodeBlock || targetNodeBlock) {
      return { status: 'Block' };
    }

    let gScore = new Map(), fScore = new Map(), parents = new Map();
    gScore.set(startNode, 0);

    let f = gScore.get(startNode) + this.distance(startNode, targetNode);
    fScore.set(startNode, f);

    let close = new Set([]);
    let open = new MinBinaryHeap(node => fScore.get(node));

    open.push(startNode);

    while (open.datas.length) {
      let current = open.pop();

      // We have found the target.
      if (current === targetNode) {
        let path = [];
        let cursor = current;

        while (cursor !== startNode) {
          path.push({r: cursor.r, c: cursor.c});
          cursor = parents.get(cursor);
        }

        // Push the starting node
        //path.push({r: cursor.r, c: cursor.c});

        return { status: 'Found', path: path.reverse() };
      }

      if (!current.neighbors.length)
        this.initNeighbors(current);

      // neighborData is an Object with the neighbor cell and the topology
      current.neighbors.forEach(neighborData => {
        let neighbor = neighborData.node;

        if (!close.has(neighbor)) {
          let score = neighborData.topology === 4 ? D : D2;
          let g = gScore.get(current) + score;

          if (!open.contains(neighbor)) {
            parents.set(neighbor, current);
            gScore.set(neighbor, g);
            fScore.set(neighbor, gScore.get(neighbor) + this.distance(neighbor, targetNode));
            open.push(neighbor);
          } else {
            if (g < gScore.get(neighbor)) {
              open.remove(neighbor);
              parents.set(neighbor, current);
              gScore.set(neighbor, g);
              fScore.set(neighbor, gScore.get(neighbor) + this.distance(neighbor, targetNode));
              open.push(neighbor);
            }
          }
        }
      });

      if (!close.has(current)) {
        open.remove(current);
        close.add(current);
      }
    }

    return { status: 'None' };
  }

  /**
   * The distance between two cells (heuristic).
   * Manhattan distance for 4 directions or Octile distance for 8 directions.
   *
   * @param {number} n1 - The first Node
   * @param {number} n2 - The second Node
   * @returns The distance or undefined if the topology doesn't exists
   */
  distance(n1, n2) {
    let n1r = n1.r, n1c = n1.c;
    let n2r = n2.r, n2c = n2.c;

    let distance = undefined;

    let dr = Math.abs(n1r - n2r);
    let dc = Math.abs(n1c - n2c);

    switch (this.topology) {
      case 4:
        distance = D * (dr + dc);
        break;
      case 8:
        distance = D * (dr + dc) + (D2 - 2 * D) * Math.min(dr, dc);
        break;
      default:
        console.log('No such topology');
        break;
    }

    return distance;
  }
}
