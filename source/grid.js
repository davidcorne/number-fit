class Grid {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.grid = []
    }

}

class Cell {
    constructor(contents) {
        if (contents )
        this.contents = contents
        this.revealed = false
    }
}
/**
 * A factory function to create a grid from a string.
 * 
 * The string should have the form "W,H,N" where:
 * - W is a [0-9]+ number representing the width
 * - H is a [0-9]+ number representing the height
 * - N is a [0-9#] string of digits or # signs which has the grid contents, # denoting an unfillable cell
 * e.g. "4,3,123##4##5678" would represent
 * |1 2 3 #|
 * |# 4 # #|
 * |5 6 7 8|
 * 
 * @param {string} encodedGrid The string containing an encoding of the grid.
 * @returns {Grid} The grid with the contents from the string
 */
const gridFromString = function(encodedGrid) {
    const parser = /([0-9]+),([0-9]+),([0-9#]+)/
    const match = encodedGrid.match(parser)
    if (!match) {
        //TODO error
    }
    const width = parseInt(match[1])
    const height = parseInt(match[2])
    const contents = match[3]
    const grid = new Grid(width, height)
    return grid
}
