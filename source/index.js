const gridModule = require("./grid")

function main() {
    const g = gridModule.Grid.fromString("4,3,123##4##5678")
    console.log(g.toString())
}

main()
