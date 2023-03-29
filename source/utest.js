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
        assert.strictEqual(testGrid.cell(0, 0).content, "1")
        assert.strictEqual(testGrid.cell(1, 0).content, "2")
        assert.strictEqual(testGrid.cell(2, 0).content, "3")
        assert.strictEqual(testGrid.cell(3, 0).content, "#")

        assert.strictEqual(testGrid.cell(0, 1).content, "#")
        assert.strictEqual(testGrid.cell(1, 1).content, "4")
        assert.strictEqual(testGrid.cell(2, 1).content, "#")
        assert.strictEqual(testGrid.cell(3, 1).content, "#")

        assert.strictEqual(testGrid.cell(0, 2).content, "5")
        assert.strictEqual(testGrid.cell(1, 2).content, "6")
        assert.strictEqual(testGrid.cell(2, 2).content, "7")
        assert.strictEqual(testGrid.cell(3, 2).content, "8")
    })
})