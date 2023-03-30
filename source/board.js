/**
 * Counts the number of occurances of element in array
 * 
 * @param {Array} array The array to count occurances
 * @param {any} elementToFind The element to count occurances in
 */
const occurances = function(array, elementToFind) {
    let count = 0
    for (const element of array) {
        if (element === elementToFind) {
            ++count
        }
    }
    return count
}

/**
 * Return a random valid index given the length of an array
 * 
 * @param {Number} length The length of the array you want a random index for
 * @returns {Number} A random number between [0, length-1]
 */
const randomIndex = function(length) {
    return Math.floor(Math.random() * length)
}

/**
 * Return a random digit, [0-9]
 * 
 * @returns {Number} A random digit between [0-9]
 */
const randomDigit = function() {
    return randomIndex(10)
}

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

    static random(width, height) {
        // Algorithm
        // 1. Make a correctly sized array
        // 2. Fill it with 40% blank spaces
        // 3. Fill it with random numbers
        // 4. Create the grid
        // 5. Move the spaces around so that the shape of the grid is right
        // 6. Return it

        // 1. Make a correctly sized array
        const total = width * height
        const contentArray = Array(total)

        // 2. Fill it with 40% blank spaces
        const blanks = parseInt(total * 0.4)
        while (occurances(contentArray, "#") < blanks) {
            const index = randomIndex(total)
            contentArray[index] = "#"
        }

        // 3. Fill it with random numbers
        for (let i = 0; i < total; ++i) {
            if (contentArray[i] !== "#") {
                contentArray[i] = randomDigit()
            }
        }
        // 4. Create the grid
        const encodedString = [
            width.toString(),
            ",",
            height.toString(),
            ",",
            contentArray.join("")
        ]
        const grid = this.fromString(encodedString.join(""))
        // 5. Move the spaces around so that the shape of the grid is right
        // 5.1 Remove any isolated numbers. We don't want any single numbers
        //TODO not sure what more to do
        grid.removeIsolatedCells()
        
        // 6. Return it
        return grid
    }
    
    cell(x, y) {
        const index = x + (y * this.width)
        return this.#grid[index]
    }
    
    /**
     * Return the neighbours of the given cell
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Array} An array of the cells perpendicular to the x,y cell.
     */
    neighbours(x, y) {
        const neighbours = []
        if (x - 1 >= 0) {
            neighbours.push(this.cell(x - 1, y))
        }
        if (x + 1 < this.width) {
            neighbours.push(this.cell(x + 1, y))
        }
        if (y - 1 >= 0) {
            neighbours.push(this.cell(x, y - 1))
        }
        if (y + 1 < this.height) {
            neighbours.push(this.cell(x, y + 1))
        }
        return neighbours
    }

    removeIsolatedCells() {
        const isolated = this.isolatedCells()
        for (const cell of isolated) {
            // Get the neighbours of the isolated cells, randomly change one of them to a digit
            const neighbours = this.neighbours(cell[0], cell[1])
            const index = randomIndex(neighbours.length)
            neighbours[index].content = randomDigit()
        }
    }

    /**
     * Find and return any number cells which are surrounded by unfillable cells.
     * 
     * @returns {Cell[]} The Array of cells which are isolated. (may be empty)
     */
    isolatedCells() {
        const cells = []
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                // Don't worry if we're not fillable
                if (!this.cell(x, y).fillable()) {
                    continue
                }
                const neighbours = this.neighbours(x, y)
                const isNotFillable = (cell) => {
                    return !cell.fillable()
                }
                if (neighbours.every(isNotFillable)) {
                    cells.push([x, y])
                }
            }
        }
        return cells
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
        if (!content.match(/[0-9#]/)) {
            throw new Error(`Unexpected cell contents: ${content}`)
        }
        this.content = content
        this.revealed = false
    }

    fillable() {
        return this.content !== "#"
    }

    toString() {
        return this.content
    }
}

module.exports.Grid = Grid
