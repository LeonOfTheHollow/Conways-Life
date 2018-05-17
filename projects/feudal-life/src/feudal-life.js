/**
 * Implemention of a CCA
 */

const MODULO = 4;

/**
 * Make a 2D array helper function
 */
function Array2D(width, height) {
  //NOTE:  Iterate through Array2D row first then column
  let a = new Array(height);

  for (let i = 0; i < height; i++) {
    a[i] = new Array(width);
  }

  return a;
}

/**
 * CCA class
 */
class FeudalLife {
  /**
   * Constructor
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.currentBufferIndex = 0;

    this.cells = [Array2D(width, height), Array2D(width, height)];

    this.randomize();

    this.clear();
  }

  /**
   * Return the current active buffer
   *
   * This should NOT be modified by the caller
   */
  getCells() {
    return this.cells[this.currentBufferIndex];
  }

  /**
   * Clear the cca grid
   */
  clear() {}

  /**
   * Randomize the cca grid
   */
  randomize() {
    let buffer = this.cells[this.currentBufferIndex];
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        buffer[row][col] = (Math.random() * MODULO) | 0;
      }
    }
    // console.log('cells after randomize', this.cells);
  }

  /**
   * Run the simulation for a single step
   */
  step() {
    let backBufferIndex = this.currentBufferIndex === 0 ? 1 : 0;
    let currentBuffer = this.cells[this.currentBufferIndex];
    let backBuffer = this.cells[backBufferIndex];

    function countNeighbors(row, col) {
      //let livingCount = 0;

      let neighborsInfo = {
        red: 0,
        green: 0,
        blue: 0
      };

      const checkNeighbor = (counters, value) => {
        switch(value) {
          case 0:
            break;
          case 1:
            counters.red++;
            break;
          case 2:
            counters.blue++;
            break;
          case 3:
            counters.green++;
            break;
          default:
            console.error("Tried to check a neighbor but didn't have logic for it. It had value: ", value);
            break;
        }
      }
      // 000
      // XA0
      // 000

      // TODO:  Refactor into using some sort of loop
      // there must only be ONE switch stement here

      // After fixing ^^, add another color

      // West
      if (col > 0) {
        checkNeighbor(neighborsInfo, currentBuffer[row][col - 1]);
      }

      // Northwest
      if (col > 0 && row > 0) {
        checkNeighbor(neighborsInfo, currentBuffer[row - 1][col - 1]);
      }

      // North
      if (row > 0) {
        checkNeighbor(neighborsInfo, currentBuffer[row - 1][col]);
      }

      // Northeast
      if (col < this.width - 1 && row > 0) {
        checkNeighbor(neighborsInfo, currentBuffer[row - 1][col + 1]);
      }

      // East
      if (col < this.width - 1) {
        checkNeighbor(neighborsInfo, currentBuffer[row][col + 1]);
      }

      // Southeast
      if (col < this.width - 1 && row < this.height - 1) {
        checkNeighbor(neighborsInfo, currentBuffer[row + 1][col + 1]);
      }

      // South
      if (row < this.height - 1) {
        checkNeighbor(neighborsInfo, currentBuffer[row + 1][col]);
      }

      // Southwest
      if (col > 0 && row < this.height - 1) {
        checkNeighbor(neighborsInfo, currentBuffer[row + 1][col - 1]);
      }

      return neighborsInfo;
    }

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const neighbors = countNeighbors.call(this, row, col);
        // console.log(neighbors);
        const totalNeighbors = neighbors.red + neighbors.green + neighbors.blue;

        let dominantColor = currentBuffer[row][col];
        if (neighbors.red > neighbors.blue && neighbors.red > neighbors.green) {
          dominantColor = 1;
        }
        if (
          neighbors.green > neighbors.red &&
          neighbors.green > neighbors.blue
        ) {
          dominantColor = 2;
        }
        if (
          neighbors.blue > neighbors.red &&
          neighbors.blue > neighbors.green
        ) {
          dominantColor = 3;
        }

        // "Elements of War"
        // Each cell is red, green, blue, or dead.
        // All Game of Life rules still apply.
        // When counting neighbors, also keep tally of how many neighbors of each color are present.
        // If at least ONE neighbor of a cell is the color that "beats" it, kill the cell. Red>Green>Blue>Red.
        // Every step, update each cell to be the same color as the most common color amongst its neighbors.
        // If tie, stay same color

        // If living
        if (currentBuffer[row][col]) {
          //console.log('found alive cell');
          // do alive rules
          //console.log(totalNeighbors);
          if (totalNeighbors < 2 || totalNeighbors > 3) {
            //console.log('and killed it');
            backBuffer[row][col] = 0;
          } else {
            backBuffer[row][col] = dominantColor;
          }
        } else {
          // do dead rules
          if (totalNeighbors === 3) {
            backBuffer[row][col] = dominantColor;
          } else {
            backBuffer[row][col] = currentBuffer[row][col];
          }
        }
      }
    }
    this.currentBufferIndex = this.currentBufferIndex === 0 ? 1 : 0;
  }
}

export default FeudalLife;
