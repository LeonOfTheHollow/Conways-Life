/**
 * Implemention of a CCA
 */

const MODULO = 7;

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
    backBuffer = backBuffer.fill(0);

    function countNeighbors(row, col) {
      //let livingCount = 0;

      let neighborsInfo = {
        summerKnights: 0,
        summerPeasants: 0,
        winterKnights: 0,
        winterPeasants: 0,
      };
      // green 0 | orange 1 | red 2 | yellow 3 | blue 4 | purple 5 | teal 6
      const incrementNeighbors = (counts, value) => {
        switch(value) {
          case 0:
            break;
          case 1:
            counts.summerPeasants++;
            break;
          case 2:
            counts.summerKnights++;
            break;
          case 3: break;
          case 4:
            counts.winterPeasants++;
            break;
          case 5:
            counts.winterKnights++;
            break;
          case 6: break;
          default:
            console.error("Tried to check a neighbor but didn't have logic for it. It had value: ", value);
            break;
        }
      }
      // West
      if (col > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row][col - 1]);
      }

      // Northwest
      if (col > 0 && row > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row - 1][col - 1]);
      }

      // North
      if (row > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row - 1][col]);
      }

      // Northeast
      if (col < this.width - 1 && row > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row - 1][col + 1]);
      }

      // East
      if (col < this.width - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row][col + 1]);
      }

      // Southeast
      if (col < this.width - 1 && row < this.height - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row + 1][col + 1]);
      }

      // South
      if (row < this.height - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row + 1][col]);
      }

      // Southwest
      if (col > 0 && row < this.height - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row + 1][col - 1]);
      }

      return neighborsInfo;
    }

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {

        const currentCell = currentBuffer[row][col];
        const currentNeighbors = {
          west: (col > 0 )? currentBuffer[row][col - 1] : 0,
          northwest: (col > 0 && row > 0) ? currentBuffer[row - 1][col - 1] : 0,
          north: (row > 0) ? currentBuffer[row - 1][col] : 0,
          northeast: (col < this.width - 1 && row > 0) ? currentBuffer[row - 1][col + 1] : 0,
          east: (col < this.width - 1) ? currentBuffer[row][col + 1] : 0,
          southeast: (col < this.width - 1 && row < this.height - 1) ? currentBuffer[row + 1][col + 1] : 0,
          south: (row < this.height - 1) ? currentBuffer[row + 1][col] : 0,
          southwest: (col > 0 && row < this.height - 1) ? currentBuffer[row + 1][col - 1] : 0,
        }
      
        let bufferedCell = backBuffer[row][col];
        const bufferedNeighbors = {
          west: (col > 0 )? backBuffer[row][col - 1] : 0,
          northwest: (col > 0 && row > 0) ? backBuffer[row - 1][col - 1] : 0,
          north: (row > 0) ? backBuffer[row - 1][col] : 0,
          northeast: (col < this.width - 1 && row > 0) ? backBuffer[row - 1][col + 1] : 0,
          east: (col < this.width - 1) ? backBuffer[row][col + 1] : 0,
          southeast: (col < this.width - 1 && row < this.height - 1) ? backBuffer[row + 1][col + 1] : 0,
          south: (row < this.height - 1) ? backBuffer[row + 1][col] : 0,
          southwest: (col > 0 && row < this.height - 1) ? backBuffer[row + 1][col - 1] : 0,
        }
        const currentCellInfo = countNeighbors.call(this, row, col);
        // Wyld: 
          // If there are at least three neigboring Peasants of one faction, become a Peasant.
          // If there are multiple factions present, populate with the largest.
        // Peasant:
          // Standard Game of Life rules, counting all allies as live and all enemies as dead.
          // Dies if it neighbors an opposing Knight.
        // Knight:
          // Becomes Wyld if it has no neighbors who are Peasants (either faction).
          // If it has three or more allied Peasant neighbors, one of them becomes a Knight.
          // If it has at least one Knight neighbor, it and one of those Knight neighbors becomes Wyld.
          // If it neighbors the opposing Queen do something cool.
        // Queen:
          // For the list of all neighbors and neighbors' neighbors:
          // 75% chance of becoming Peasant
          // One becomes Knight
        // WYLD 0 | SPEASANT 1 | SKNIGHT 2 | SQUEEN 3 | WPEASANT 4 | WKNIGHT 5 | WQUEEN 6
        switch(currentCell) {
          case 0: //Wyld
            if (currentCellInfo.summerPeasants > 2 && currentCellInfo.summerPeasants > currentCellInfo.winterPeasants) {
              bufferedCell = 1;
            } else if (currentCellInfo.winterPeasants > 2 && currentCellInfo.winterPeasants > currentCellInfo.summerPeasants) {
              bufferedCell = 4;
            }
            break;
          case 1: //Summer Peasant
            const totalSummerAllies = currentCellInfo.summerPeasants + currentCellInfo.summerKnights;
            if (totalSummerAllies < 2) bufferedCell = 0;
            if (totalSummerAllies > 3) bufferedCell = 0;
            if (currentCellInfo.winterKnights) bufferedCell = 0;
            break;
          case 2: //Summer Knight
            if (!currentCellInfo.summerPeasants && !currentCellInfo.winterPeasants) bufferedCell = 0;
            if (currentCellInfo.summerPeasants > 2) {
              let doneKnighting = false;
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 1 && !doneKnighting) {
                  bufferedNeighbors[dir] = 2;
                  doneKnighting = true;
                }
              }
            }
            if (currentCellInfo.winterKnights) {
              let doneDuelling = false;
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 5 && !doneDuelling) {
                  bufferedNeighbors[dir] = 0;
                  bufferedCell = 0;
                  doneDuelling = true;
                }
              }
            }
            break;
          case 3: //Summer Queen
              for (const dir in currentNeighbors) {
                bufferedCell = currentCell;
                bufferedNeighbors[dir] = Math.random() > 0.8 ? 2 : 1;
              }
            break;
          case 4: //Winter Peasant
            const totalWinterAllies = currentCellInfo.winterPeasants + currentCellInfo.winterKnights;
            if (totalWinterAllies < 2) bufferedCell = 0;
            if (totalWinterAllies > 3) bufferedCell = 0;
            if (currentCellInfo.summerKnights) bufferedCell = 0;
            break;
          case 5: //Winter Knight
            if (!currentCellInfo.summerPeasants && !currentCellInfo.winterPeasants) bufferedCell = 0;
            if (currentCellInfo.winterPeasants > 2) {
              let doneKnighting = false;
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 4 && !doneKnighting) {
                  bufferedNeighbors[dir] = 5;
                  doneKnighting = true;
                }
              }
            }
            if (currentCellInfo.summerKnights) {
              let doneDuelling = false;
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 2 && !doneDuelling) {
                  bufferedNeighbors[dir] = 0;
                  bufferedCell = 0;
                  doneDuelling = true;
                }
              }
            }
            break;
          case 6: //Winter Queen
          for (const dir in currentNeighbors) {
            bufferedNeighbors[dir] = Math.random() > 0.8 ? 5 : 4;
          }
            break;
        }
      }
    }
    this.currentBufferIndex = this.currentBufferIndex === 0 ? 1 : 0;
  }
}

export default FeudalLife;

        // "Life is Feudal"
        // Each cell is red (Knight), orange (Peasant), or yellow (Queen) [SUMMER], purple (Knight), blue (Peasant), or teal (Queen) [WINTER], or green [WYLD].
        // Game of Life rules apply to Peasants within their own faction. [WYLD] or opposed cells count as empty at this phase.
        // At the beginning of the game, every cell is green, except one which is yellow [SUMMER QUEEN] and one which is teal [WINTER QUEEN].
        // Different pieces play by different rules.
        // Each Queen sets all of its neighbors and neighbor's neighbors to be Peasants at 0.75 probability and one of its neighbors to be a Knight, at random.

        // Wyld: 
          // If there are at least three neigboring Peasants of one faction, become a Peasant.
          // If there are multiple factions present, populate with the largest.
        // Peasant:
          // Standard Game of Life rules, counting all allies as live and all enemies as dead.
        // Knight:
          // Becomes Wyld if it has no neighbors who are Peasants (either faction).
          // If it has three or more allied Peasant neighbors, one of them becomes a Knight.
          // If it has one or more enemy Peasant neighbors, one of them becomes Wyld.
          // If it has at least one Knight neighbor, it and one of those Knight neighbors becomes Wyld.
          // If it neighbors the opposing Queen do something cool.
        // Queen:
          // For the list of all neighbors and neighbors' neighbors:
          // 75% chance of becoming Peasant
          // One becomes Knight
