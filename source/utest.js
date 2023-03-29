'use strict'

const rewire = require("rewire")
const chai = require('chai')
const assert = chai.assert

const gridModule = rewire("./grid.js")

describe("Grid", function() {
    it("Construct from string", function() {
        const Grid = gridModule.__get__("Grid")

        // This works with the grid
        // |1 2 3 #|
        // |# 4 # #|
        // |5 6 7 8|
        const encodedGrid = "4,3,123##4##5678"
        const testGrid = Grid.fromString(encodedGrid)
        assert.strictEqual(testGrid.width, 4)
        assert.strictEqual(testGrid.height, 3)

        // Now check the grid is correct
        assert.strictEqual(testGrid.cell(0, 0).contents, "1")
        assert.strictEqual(testGrid.cell(0, 1).contents, "2")
        assert.strictEqual(testGrid.cell(0, 2).contents, "3")
        assert.strictEqual(testGrid.cell(0, 3).contents, "#")

        assert.strictEqual(testGrid.cell(1, 0).contents, "#")
        assert.strictEqual(testGrid.cell(1, 1).contents, "4")
        assert.strictEqual(testGrid.cell(1, 2).contents, "#")
        assert.strictEqual(testGrid.cell(1, 3).contents, "#")

        assert.strictEqual(testGrid.cell(2, 0).contents, "5")
        assert.strictEqual(testGrid.cell(2, 1).contents, "6")
        assert.strictEqual(testGrid.cell(2, 2).contents, "7")
        assert.strictEqual(testGrid.cell(2, 3).contents, "8")
    })
})