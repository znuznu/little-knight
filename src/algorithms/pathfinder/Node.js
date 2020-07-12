export default class Node {
  /**
   * Represent a Node of the grid (based on the original
   * user grid) used by the A-Star.
   *
   * @constructor
   * @param {number} r - row coordinate of the Cell.
   * @param {number} c - col coordinate of the Cell.
   * @param {*} data - The data related to the original Object.
   */
  constructor(r, c, data) {
    this.r = r;
    this.c = c;
    this.data = data;
    this.neighbors = [];
  }
}
