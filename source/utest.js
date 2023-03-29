'use strict'

const rewire = require("rewire")
const chai = require('chai')
const assert = chai.assert

const gridModule = rewire("./grid.js")

describe("Utilities", function() {
    it("occurances", function() {
        const occurances = gridModule.__get__("occurances")
        const testCases = [
            [["a", "b", "c"], "a", 1],
            [["a", "b", "c"], "d", 0]
        ]
        for (let testCase of testCases) {
            assert.strictEqual(occurances(testCase[0], testCase[1]), testCase[2])
        }
    })
})

describe("Grid", function() {
    const Grid = gridModule.__get__("Grid")

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
    })
    
})