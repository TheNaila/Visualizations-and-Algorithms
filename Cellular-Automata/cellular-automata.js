let CONFIG; 
let RULE;
let ITERATIONS; 
let CELLSIZE;

function setConfig(length, onAtIndex){
let arr = []
for (let index = 0; index < length; index++) {
    arr[index] = 0
    }
if(onAtIndex.length > arr.length){
    return "Length of config array must be greater than the index array"
 }
for (let index = 0; index < onAtIndex.length; index++) {
    
    try{
        arr[onAtIndex[index]] = 1
    }
    catch(err){
        console.log(err)
        console.log("Check the values in your index array. They may be out of bound of the configiruation array")

    }
    
}
return arr
} 


//! Set Values Here
/*
You can provide the length of the grid that you want (W x W)
You can pick the individual indices that you want to turn on 
*/
CONFIG = setConfig(30, [0,1,2,3,27,29,12])
RULE = 90
ITERATIONS = 100
CELLSIZE = 20 //in pixels

function applyRule(config,Rule){
let updateRule = biggestPowerofTwo(Rule);
let self; 
let right;
let left;
nextState = []
for (let index = 0; index < config.length; index++) {
    self = config[index]
   if(index == 0){
    right = config[index + 1]
    left = config[ config.length - 1]
   }
   else if(index == config.length - 1){
    right = config[0]
    left = config[index - 1]
   }
   else{
   right = config[index + 1]
   left = config[index - 1]
   }

//    ////////////////////////////////
if(self == 0 && right == 0 && left == 0){
    nextState[index] = updateRule[0]
}
   else if(self == 0 && right == 1 && left == 0){
    nextState[index] = updateRule[1]
   }
   else if(self == 1 && right == 0 && left == 0){
    nextState[index] = updateRule[2]
   }
   else if(self == 1 && right == 1 && left == 0){
    nextState[index] = updateRule[3]
   }
   else if(self == 0 && right == 0 && left == 1){
    nextState[index] = updateRule[4]
   }
   else if(self == 0 && right == 1 && left == 1){
    nextState[index] = updateRule[5]
   }
   else if(self == 1 && right == 0 && left == 1){
    nextState[index] = updateRule[6]
   }
   else if(self == 1 && right == 1 && left == 1){
    nextState[index] = updateRule[7]
   }

    }
return nextState
}

function biggestPowerofTwo(Rule){
binaryRep = [-1,-1,-1,-1,-1,-1,-1,-1]
for (let index = 0; index < 8; index++) { //rule array / need to figure out the element at each array index
    for (let powerofTwo = 8; powerofTwo >= 0; powerofTwo --) {
        current = 2**powerofTwo
        if(Rule - current >= 0 ){
            binaryRep[powerofTwo] = 1
            Rule = Rule - current
        }
        
    }
}
for (let index = 0; index < 8; index++) {
    if(binaryRep[index] == -1){
        binaryRep[index] = 0
    }
}

return binaryRep

}

///////////////////////////////////////////////////////////////////////////////////////////////////
function createGrid(){
    let mainDiv = document.getElementById("main")
    let innerCellSize = CELLSIZE
    let header = document.createElement("h1")
    header.innerText = "Cellular Automata"
    mainDiv.appendChild(header)

    let cellGrid = document.createElement("div")
    cellGrid.classList.add("cell-grid")
    let widthHeight = "width:" + (CONFIG.length * innerCellSize) + "px; " + "height:" + (ITERATIONS * innerCellSize) + "px;"
    cellGrid.style = widthHeight
    mainDiv.appendChild(cellGrid)

    widthHeight = "width:" + innerCellSize + "px;" + "height:" + innerCellSize + "px;"
    
    let state = CONFIG
   
    for (let index = 0; index < ITERATIONS; index++) {
        let row = document.createElement("div")
        row.classList.add("row")
        row.style = "width:" + (CONFIG.length * innerCellSize) + "px; "
        cellGrid.appendChild(row)
        for (let index = 0; index < CONFIG.length; index++) {
            let innerCells = document.createElement('div')
            innerCells.style = widthHeight
            innerCells.classList.add("inner-cells")
            if(state[index] == 1){
                innerCells.classList.add("black")
            }
           row.appendChild(innerCells)
        }
        state = applyRule(state,RULE)
        console.log(state)
}

    

}

module.exports = { applyRule};
