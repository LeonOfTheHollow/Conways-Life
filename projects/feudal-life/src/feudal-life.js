/**
 * Implemention of a CCA
 */

const MODULO = 7;
const SPAWN_PULSE_WIDTH = 2;
const CARRYING_CAPACITY = 9; // Set higher than 8 to disable starvation completely
const RESOURCE_CONSUMPTION = true;
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
   * Randomize the cca grid
   */
  randomize() {
    let buffer = this.cells[this.currentBufferIndex];
    const winterQueenX = Math.floor(Math.random() * this.height);
    const winterQueenY = Math.floor(Math.random() * this.width);
    buffer[winterQueenX][winterQueenY] = 6;

    const summerQueenX = Math.floor(Math.random() * this.height);
    const summerQueenY = Math.floor(Math.random() * this.width);
    buffer[summerQueenX][summerQueenY] = 3;

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        // buffer[row][col] = (Math.random() * (MODULO)) | 0;
        // if (Math.random() > 0.9) buffer[row][col] = 1;
        // else if (Math.random() > 0.98) buffer[row][col] = 2;
        // else if (Math.random() < 0.10) buffer[row][col] = 4;
        // else if (Math.random() < 0.02) buffer[row][col] = 5;
        // else buffer[row][col] = 0;
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
      let neighborsInfo = {
        summerKnights: 0,
        summerPeasants: 0,
        winterKnights: 0,
        winterPeasants: 0
      };
      // green 0 | orange 1 | red 2 | yellow 3 | blue 4 | purple 5 | teal 6
      const incrementNeighbors = (counts, value) => {
        switch (value) {
          case 0:
            break;
          case 1:
            counts.summerPeasants++;
            break;
          case 2:
            counts.summerKnights++;
            break;
          case 3:
            break;
          case 4:
            counts.winterPeasants++;
            break;
          case 5:
            counts.winterKnights++;
            break;
          case 6:
            break;
          default:
            break;
        }
      };
      // West
      if (col > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row][col - 1]);
      }

      // Northwest
      else if (col > 0 && row > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row - 1][col - 1]);
      }

      // North
      else if (row > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row - 1][col]);
      }

      // Northeast
      else if (col < this.width - 1 && row > 0) {
        incrementNeighbors(neighborsInfo, currentBuffer[row - 1][col + 1]);
      }

      // East
      else if (col < this.width - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row][col + 1]);
      }

      // Southeast
      else if (col < this.width - 1 && row < this.height - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row + 1][col + 1]);
      }

      // South
      else if (row < this.height - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row + 1][col]);
      }

      // Southwest
      else if (col > 0 && row < this.height - 1) {
        incrementNeighbors(neighborsInfo, currentBuffer[row + 1][col - 1]);
      }

      return neighborsInfo;
    }
    
    let summerQueenPasses = 0;
    let winterQueenPasses = 0;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const currentCell = currentBuffer[row][col];
        const currentCellInfo = countNeighbors.call(this, row, col);
        const currentNeighbors = {
          west:
            col > 0
              ? currentBuffer[row][col - 1]
              : 0, //currentBuffer[row][this.width - 1],
          northwest:
            col > 0 && row > 0
              ? currentBuffer[row - 1][col - 1]
              : 0, //currentBuffer[this.height - 1][this.width - 1],
          north:
            row > 0
              ? currentBuffer[row - 1][col]
              : 0, //currentBuffer[this.height - 1][col],
          northeast:
            col < this.width - 1 && row > 0
              ? currentBuffer[row - 1][col + 1]
              : 0, //currentBuffer[this.height - 1][0],
          east:
            col < this.width - 1
              ? currentBuffer[row][col + 1]
              : 0, //currentBuffer[row][0],
          southeast:
            col < this.width - 1 && row < this.height - 1
              ? currentBuffer[row + 1][col + 1]
              : 0, //currentBuffer[0][0],
          south:
            row < this.height - 1
              ? currentBuffer[row + 1][col]
              : 0, //currentBuffer[0][col],
          southwest:
            col > 0 && row < this.height - 1
              ? currentBuffer[row + 1][col - 1]
              : 0, //currentBuffer[0][this.width - 1]
        };

        let bufferedCell = backBuffer[row][col];
        let bufferedNeighbors = {
          west:
            col > 0
              ? backBuffer[row][col - 1]
              : backBuffer[row][this.width - 1],
          northwest:
            col > 0 && row > 0
              ? backBuffer[row - 1][col - 1]
              : backBuffer[this.height - 1][this.width - 1],
          north:
            row > 0
              ? backBuffer[row - 1][col]
              : backBuffer[this.height - 1][col],
          northeast:
            col < this.width - 1 && row > 0
              ? backBuffer[row - 1][col + 1]
              : backBuffer[this.height - 1][0],
          east:
            col < this.width - 1
              ? backBuffer[row][col + 1]
              : backBuffer[row][0],
          southeast:
            col < this.width - 1 && row < this.height - 1
              ? backBuffer[row + 1][col + 1]
              : backBuffer[0][0],
          south:
            row < this.height - 1
              ? backBuffer[row + 1][col]
              : backBuffer[0][col],
          southwest:
            col > 0 && row < this.height - 1
              ? backBuffer[row + 1][col - 1]
              : backBuffer[0][this.width - 1]
        };

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
        const writeToNeighbor = (neighbor, value) => {
          switch (neighbor) {
            case "west":
              if (col > 0) backBuffer[row][col - 1] = value;
              else backBuffer[row][this.width - 1] = value;
              break;
            case "northwest":
              if (col > 0 && row > 0) backBuffer[row - 1][col - 1] = value;
              else backBuffer[this.height - 1][this.width - 1] = value;
              break;
            case "north":
              if (row > 0) backBuffer[row - 1][col] = value;
              else backBuffer[this.height - 1][col] = value;
              break;
            case "northeast":
              if (col < this.width - 1 && row > 0) backBuffer[row - 1][col + 1] = value;
              else backBuffer[this.height - 1][0] = value;
              break;
            case "east":
              if (col < this.width - 1) backBuffer[row][col + 1] = value;
              else backBuffer[row][0] = value;
              break;
            case "southeast":
              if (col < this.width - 1 && row < this.height - 1) backBuffer[row + 1][col + 1] = value;
              else backBuffer[0][0] = value;
              break;
            case "south":
              if (row < this.height - 1) backBuffer[row + 1][col] = value;
              else backBuffer[0][col] = value;
              break;
            case "southwest":
              if (col > 0 && row < this.height - 1) backBuffer[row + 1][col - 1] = value;
              else backBuffer[0][this.width - 1] = value;
              break;
          }
        };
        switch (currentCell) {
          case 0: //Wyld
            if (
              currentCellInfo.summerPeasants + currentCellInfo.summerKnights > 2 &&
              currentCellInfo.summerPeasants + currentCellInfo.summerKnights > currentCellInfo.winterPeasants + currentCellInfo.summerKnights
            ) {
              backBuffer[row][col] = 1;
            } else if (
              currentCellInfo.winterPeasants + currentCellInfo.winterKnights > 2 &&
              currentCellInfo.winterPeasants + currentCellInfo.winterKnights > currentCellInfo.summerPeasants + currentCellInfo.summerKnights
            ) {
              backBuffer[row][col] = 4;
            } else {
              backBuffer[row][col] = 0;
            }
            break;

          case 1: //Summer Peasant
            const totalSummerAllies =
              currentCellInfo.summerPeasants + currentCellInfo.summerKnights;
            if (totalSummerAllies < 2) backBuffer[row][col] = 0;
            else if (totalSummerAllies > CARRYING_CAPACITY) backBuffer[row][col] = 0; //Overpopulation rule: toggleable
            else if (currentCellInfo.winterKnights) backBuffer[row][col] = 0;
            else backBuffer[row][col] = 1;
            if (Math.random() > 0.999) backBuffer[row][col] = 5;
            break;

          case 2: //Summer Knight
            if (currentCellInfo.summerPeasants > 2) {
              const eligiblePeasants = [];
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 1) {
                  eligiblePeasants.push(dir);
                }
              }
              writeToNeighbor(
                eligiblePeasants[
                  Math.floor(Math.random() * eligiblePeasants.length)
                ],
                2
              );
              //backBuffer[row][col] = 2;
            }
            if (currentCellInfo.winterKnights) {
              const eligibleFoes = [];
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 5) {
                  eligibleFoes.push(dir);
                }
              }
              writeToNeighbor(
                eligibleFoes[Math.floor(Math.random() * eligibleFoes.length)],
                0
              );
              backBuffer[row][col] = 0;
            } else if (currentCellInfo.winterPeasants) {
              const eligibleConverts = [];
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 4) eligibleConverts.push(dir);
              }
              writeToNeighbor(
                eligibleConverts[
                  Math.floor(Math.random() * eligibleConverts.length)
                ],
                2
              );
              backBuffer[row][col] = 1; //Leave behind a loyal peasant
            } else {
              backBuffer[row][col] = 2;
            }
            if (
              !currentCellInfo.summerPeasants &&
              !currentCellInfo.winterPeasants
            )
              backBuffer[row][col] = 0;
            //backBuffer[row][col] = 2
            break;

          case 3: //Summer Queen
            summerQueenPasses++;
            if (true) {
              for (const dir in currentNeighbors) {
                writeToNeighbor(dir, Math.random() > 0.99 ? 2 : 1);
              }
              summerQueenPasses = 0;
            }
            if (currentBuffer[row][col] === 3) backBuffer[row][col] = 3;
            else backBuffer[row][col] = 0;
            break;

          case 4: //Winter Peasant
            const totalWinterAllies =
              currentCellInfo.winterPeasants + currentCellInfo.winterKnights;
            if (totalWinterAllies < 2) backBuffer[row][col] = 0;
            else if (totalWinterAllies > CARRYING_CAPACITY) backBuffer[row][col] = 0; // Overpopulation rule: toggle
            else if (currentCellInfo.summerKnights) backBuffer[row][col] = 0;
            else backBuffer[row][col] = 4;
            if (Math.random() > 0.999) backBuffer[row][col] = 2;
            break;

          case 5: //Winter Knight
            if (currentCellInfo.winterPeasants > 2) {
              const eligiblePeasants = [];
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 4) {
                  eligiblePeasants.push(dir);
                }
              }
              writeToNeighbor(
                eligiblePeasants[
                  Math.floor(Math.random() * eligiblePeasants.length)
                ],
                5
              );
              //backBuffer[row][col] = 2;
            }
            if (currentCellInfo.summerKnights) {
              const eligibleFoes = [];
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 2) {
                  eligibleFoes.push(dir);
                }
              }
              writeToNeighbor(
                eligibleFoes[Math.floor(Math.random() * eligibleFoes.length)],
                0
              );
              backBuffer[row][col] = 0;
            } else if (currentCellInfo.summerPeasants) {
              const eligibleConverts = [];
              for (const dir in currentNeighbors) {
                if (currentNeighbors[dir] === 1) eligibleConverts.push(dir);
              }
              writeToNeighbor(
                eligibleConverts[
                  Math.floor(Math.random() * eligibleConverts.length)
                ],
                5
              );
              backBuffer[row][col] = 4; //Leave behind a loyal peasant
            } else {
              backBuffer[row][col] = 5;
            }
            if (
              !currentCellInfo.summerPeasants &&
              !currentCellInfo.winterPeasants
            )
              backBuffer[row][col] = 0;
            //backBuffer[row][col] = 5
            break;

          case 6: //Winter Queen
            winterQueenPasses++;
            if (true) {
              for (const dir in currentNeighbors) {
                console.log("Writing...");
                writeToNeighbor(dir, Math.random() > 0.8 ? 5 : 4);
              }
              winterQueenPasses = 0;
            }
            if (currentBuffer[row][col] === 6) backBuffer[row][col] = 6;
            else backBuffer[row][col] = 0;
            break;

          default:
            backBuffer[row][col] = 0;
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
// Standard Game of Life rules, except no death for overpopulation.
// Knight:
// Becomes Wyld if it has no neighbors who are Peasants (either faction).
// If it has three or more allied Peasant neighbors, one of them becomes a Knight.
// If it has one or more enemy Peasant neighbors, one of them becomes Wyld.
// If it has at least one Knight neighbor, it and one of those Knight neighbors becomes Wyld.
