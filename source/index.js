const gridModule = require("./grid")

function main() {
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
    
    const encodedGrid = lines.join("")

    // const array = Array.from(encodedGrid)
    // const map = {}
    // for (c of array) {
    //     map[c] = map[c] ? map[c] + 1 : 1
    // }
    // console.log(map)

    const grid1 = gridModule.Grid.fromString(encodedGrid)
    console.log(grid1.toString())

    const grid2 = gridModule.Grid.random(width, height)
}

main()
