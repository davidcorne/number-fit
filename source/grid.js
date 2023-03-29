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
            throw new Error(`Incorrectly formatted string ${encodedGrid}`)
        }
        const width = parseInt(match.groups.width)
        const height = parseInt(match.groups.height)
        const content = match.groups.content
        if (content.length !== width * height) {
            throw new Error(`Content length doesn't match parsed height and width. width: ${width}, height: ${height}, content.length: ${content.length},  content: ${content}`)
        }
        const grid = new Grid(width, height)
        for (let index = 0; index < content.length; ++index) {
            const character = content[index]
            if (!character.match(/[0-9#]/)) {
                throw new Error(`Incorrect character ${character} found at index ${index} of string ${encodedGrid}`)
            }
            grid.#grid[index] = new Cell(character)
        }
        return grid
    }

    cell(x, y) {
        const index = x + (y * this.width)
        return this.#grid[index]
    }
    
    toString() {
        const lines = []
        for (let y = 0; y < this.height; ++y) {
            const line = ["|"]
            for (let x = 0; x < this.width; ++x) {
                line.push(this.cell(x, y))
                line.push(" ")
            }
            // Remove the last " "
            line.pop()
            line.push("|")
            lines.push(line.join(""))
        }
        return lines.join("\n")
    }
}

class Cell {
    constructor(content) {
        this.content = content
        this.revealed = false
    }

    toString() {
        return this.content
    }
}

module.exports.Grid = Grid
