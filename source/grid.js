class Grid {
    #grid

    constructor(width, height) {
        this.width = width
        this.height = height
        this.#grid = Array(this.width * this.height)
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
    static fromString(encodedGrid) {
        const parser = /(?<width>[0-9]+),(?<height>[0-9]+),(?<content>[0-9#]+)/
        const match = encodedGrid.match(parser)
        if (!match) {
            //TODO error
        }
        const width = parseInt(match.groups.width)
        const height = parseInt(match.groups.height)
        const content = match.groups.content
        const grid = new Grid(width, height)
        for (let index = 0; index < content.length; ++index) {
            const character = content[index]
            if (!character.match(/[0-9#]/)) {
                //TODO error
            }
            grid.#grid[index] = new Cell(character)
        }
        return grid
    }

    cell(x, y) {
        const index = (this.width * x) + y
        return this.#grid[index]
    }
    
}

class Cell {
    constructor(contents) {
        this.contents = contents
        this.revealed = false
    }
}
