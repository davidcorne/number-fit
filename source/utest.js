'use strict'

const rewire = require("rewire")
const chai = require('chai')
const assert = chai.assert

const boardModule = rewire("./board.js")
const occurances = boardModule.__get__("occurances")

describe("Utilities", function() {
    it("occurances", function() {
        const testCases = [
            [["a", "b", "c"], "a", 1],
            [["a", "b", "c"], "d", 0]
        ]
        for (let testCase of testCases) {
            assert.strictEqual(occurances(testCase[0], testCase[1]), testCase[2])
        }
    })
    it("randomInex", function() {
        // Slightly dodgy test with no seed, but if we run it enough times we should get all possible results
        const randomIndex = boardModule.__get__("randomIndex")
        const results = {}
        for (let i = 0; i < 5000; ++i) {
            const index = randomIndex(15)
            results[index] = 1
        }
        // Now check we have all of the numbers 0-14 in the results
        assert.property(results, "0")
        assert.property(results, "1")
        assert.property(results, "2")
        assert.property(results, "3")
        assert.property(results, "4")
        assert.property(results, "5")
        assert.property(results, "6")
        assert.property(results, "7")
        assert.property(results, "8")
        assert.property(results, "9")
        assert.property(results, "10")
        assert.property(results, "11")
        assert.property(results, "12")
        assert.property(results, "13")
        assert.property(results, "14")
        // And no other numbers
        assert.lengthOf(Object.values(results), 15)
    })
    it("randomDigit", function() {
        // Very similar to before, ensure that we've got all of the digits
        const randomDigit = boardModule.__get__("randomDigit")
        const results = {}
        for (let i = 0; i < 5000; ++i) {
            const index = randomDigit()
            results[index] = 1
        }
        // Now check we have the numbers 0-9 in the results
        assert.property(results, "0")
        assert.property(results, "1")
        assert.property(results, "2")
        assert.property(results, "3")
        assert.property(results, "4")
        assert.property(results, "5")
        assert.property(results, "6")
        assert.property(results, "7")
        assert.property(results, "8")
        assert.property(results, "9")
        // And no other numbers
        assert.lengthOf(Object.values(results), 10)
    })
})

describe("Grid", function() {
    const Grid = boardModule.__get__("Grid")

    it("Construct from string", function() {
        // This works with the grid
        // |1 2 3 #|
        // |# 4 # #|
        // |5 6 7 8|
        const encodedGrid1 = "4,3,123##4##5678"
        const testGrid1 = Grid.fromString(encodedGrid1)
        assert.strictEqual(testGrid1.width, 4)
        assert.strictEqual(testGrid1.height, 3)

        // Now check the grid is correct
        assert.strictEqual(testGrid1.cell(0, 0).content, "1")
        assert.strictEqual(testGrid1.cell(1, 0).content, "2")
        assert.strictEqual(testGrid1.cell(2, 0).content, "3")
        assert.strictEqual(testGrid1.cell(3, 0).content, "#")

        assert.strictEqual(testGrid1.cell(0, 1).content, "#")
        assert.strictEqual(testGrid1.cell(1, 1).content, "4")
        assert.strictEqual(testGrid1.cell(2, 1).content, "#")
        assert.strictEqual(testGrid1.cell(3, 1).content, "#")

        assert.strictEqual(testGrid1.cell(0, 2).content, "5")
        assert.strictEqual(testGrid1.cell(1, 2).content, "6")
        assert.strictEqual(testGrid1.cell(2, 2).content, "7")
        assert.strictEqual(testGrid1.cell(3, 2).content, "8")

        // This is one from the New European where I first found this puzzle.
        const lines = [
            "13,13,",
            "6##60934#6731",
            "6154#7#3#6##8",
            "0##6#7#904766",
            "20387438#3#6#",
            "0##1#7###3#6#",
            "412050##65188",
            "8##6#552#8##7",
            "7#5##0#7#3##4",
            "880243387#476",
            "##0####7##3#3",
            "4755#10104721",
            "##8##3#8##3#6",
            "##622060285##",
        ]
        const encodedGrid2 = lines.join("")
        const testGrid2 = Grid.fromString(encodedGrid2)
        assert.strictEqual(testGrid2.width, 13)
        assert.strictEqual(testGrid2.height, 13)
    })
    it("Construct randomly", function() {
        const testGrid = Grid.random(3, 5)
        assert.strictEqual(testGrid.width, 3)
        assert.strictEqual(testGrid.height, 5)
        // This should contain at most 6 blanks (40% of 15)
        let content = ""
        for (let y = 0; y < testGrid.height; ++y) {
            for (let x = 0; x < testGrid.width; ++x) {
                content += testGrid.cell(x, y)
            }
        }
        assert.isAtMost(occurances(content, "#"), 6)
        assert.isAtLeast(occurances(content, "#"), 3)
    })
    it("neighbours", function() {
        // |9 # # 7 #|
        // |7 8 6 4 9|
        // |8 3 # 9 #|
        // |2 1 # 9 #|
        // |1 # 5 # #|

        const grid = Grid.fromString("5,5,9##7#7864983#9#21#9#1#5##")
        const neighbours0_0 = grid.neighbours(0, 0)
        assert.lengthOf(neighbours0_0, 2)
    })
    it("removeIsolatedCells", function() {
        // |2 1 # #|
        // |1 # 5 #|
        const grid = Grid.fromString("4,2,21##1#5#")
        const isolated = grid.isolatedCells()
        assert.strictEqual(isolated[0][0], 2)
        assert.strictEqual(isolated[0][1], 1)
        grid.removeIsolatedCells()
        const newIsolated = grid.isolatedCells()
        assert.isEmpty(newIsolated)
    })
    it("generateClues", function() {
        // |1 2 3|
        // |# 4 #|
        // |# 6 7|
        //
        // Clues should be:
        // {
        //     "2": ["67"],
        //     "3": ["123", "246"]
        // }
        const grid1 = Grid.fromString("3,3,123#4##67")
        const clues1 = grid1.generateClues()
        assert.lengthOf(clues1.clueLengths(), 2)
        assert.deepEqual(clues1.clueLengths(), [2, 3])
        assert.deepEqual(clues1.clues(2), ["67"])
        assert.deepEqual(clues1.clues(3), ["123", "246"])
        
        // |9 # # 7 #|
        // |7 8 6 4 9|
        // |8 # # 9 #|
        // |2 # # 9 #|
        // |1 # 5 1 9|
        //
        // Clues should be:
        // {
        //   3: ["519"]
        //   5: ["78649", "97821", "74991"]
        // }
        const grid2 = Grid.fromString("5,5,9##7#786498##9#2##9#1#519")
        const clues2 = grid2.generateClues()
        assert.lengthOf(clues2.clueLengths(), 2)
        assert.deepEqual(clues2.clueLengths(), [3, 5])
        assert.deepEqual(clues2.clues(3), ["519"])
        assert.deepEqual(clues2.clues(5), ["78649", "97821", "74991"])
    })
})

describe("Clues", function() {
    const Clues = boardModule.__get__("Clues")
    it("Basic Clues", function() {
        const cluesObj = {
            2: ["12", "23"],
            3: ["123"],
            19: ["1234567890123456789"]
        }
        const clues = new Clues(cluesObj)
        const clueLengths = clues.clueLengths()
        assert.deepEqual(clueLengths, [2, 3, 19])

        assert.deepEqual(clues.clues(2), ["12", "23"])
        assert.deepEqual(clues.clues(3), ["123"])
        assert.deepEqual(clues.clues(19), ["1234567890123456789"])
    })
})