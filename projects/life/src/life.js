/**
 * Implementation of Conway's game of Life
 */

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
 * Life class
 */
class Life {

  /**
   * Constructor
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.currentBufferIndex = 0;
    this.buffer = [
      Array2D(width, height),
      Array2D(width, height),
    ];

    this.clear();
  }
  
  /**
   * Return the current active buffer
   * 
   * This should NOT be modified by the caller
   */
  getCells() {
    return this.buffer[this.currentBufferIndex];
  }

  /**
   * Clear the life grid
   */
  clear() {
    for (let rowToClear = 0; rowToClear < this.height; rowToClear++) {
      this.buffer[this.currentBufferIndex][rowToClear].fill(0);
    }
  }
  
  /**
   * Randomize the life grid
   */
  randomize() {
    let buffer = this.buffer[this.currentBufferIndex];

    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        buffer[row][column] = (Math.random() >= 0.5) ? 0 : 1;
      }
    }
  }

  /**
   * Run the simulation for a single step
   */
  step() {
    let backBufferIndex = !this.currentBufferIndex ? 1 : 0;
    let currentBuffer = this.buffer[this.currentBufferIndex];
    let backBuffer = this.buffer[backBufferIndex];

    const countNeighbors = (col, row) => {
      let neighbors = 0;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        let placeInRow = row + rowOffset;

        if (placeInRow < 0 || placeInRow === this.height) {
          continue;
        }

        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          let placeInColumn = col + colOffset;

          if (placeInColumn < 0 || placeInColumn === this.width) {
            continue;
          }

          if (!colOffset && !rowOffset) {
            continue;
          }

          neighbors += currentBuffer[placeInRow][placeInColumn];
        }
      }
      console.log("Got this many neighbors: ", neighbors)
      return neighbors;
    }

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        let neighborCount = countNeighbors(col, row);
        let thisCell = currentBuffer[row][col];

        if (thisCell === 1) {
          if (neighborCount < 2 || neighborCount > 3) {
            //Die, fool!
            backBuffer[row][col] = 0;
          } else {
            //Today - we lived.
            backBuffer[row][col] = 1;
          }
        } else {
          if (neighborCount === 3) {
            //IT'S ALIIIIIVE!
            backBuffer[row][col] = 1;
          } else {
            backBuffer[row][col] = 0;
          }
        }
      }
    }
    this.currentBufferIndex = !this.currentBufferIndex ? 1 : 0;
  }
}

export default Life;
