'use strict'

const rewire = require("rewire")
const chai = require('chai')
const assert = chai.assert

const gridModule = rewire("./grid.js")

describe("Grid", function() {
    it("Construct from string", function() {
        const gridFromString = gridModule.__get__("gridFromString")

        const encodedGrid = "4,3,123##4##5678"
        const grid = gridFromString(encodedGrid)
        assert.strictEqual(grid.width, 4)
        assert.strictEqual(grid.height, 3)
    })
})