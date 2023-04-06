const SVG_NS = "http://www.w3.org/2000/svg";
let counter = 0 
initialization()

//make one function that takes the different coordinae configurations
function initialization(){
    let SVG = document.querySelector("svg")
    let mainTriangle = document.createElementNS(SVG_NS, "polygon")
    let x = 600
    let midpoint = 300
    mainTriangle.setAttributeNS(null, "points", `0,${x} ${midpoint},0 ${x},${x}`)
    mainTriangle.setAttributeNS(null, "fill", "grey")
    SVG.appendChild(mainTriangle)

    //3 elements 

    let top = document.createElementNS(SVG_NS, "polygon")
    top.setAttributeNS(null, "points", `${formula(0, 300)},${formula(600,0)} 300,0 ${formula(300,600)},${formula(0,600)}`) //md parent left, parent top, md parent right 
    top.setAttributeNS(null, "fill", "black")
    SVG.appendChild(top)

    // let left = document.createElementNS(SVG_NS, "polygon")
    // left.setAttributeNS(null, "points", `0,600 ${formula(0, 300)},${formula(600,0)} ${formula(0,600)},${formula(600,600)}`) //parent bottom left, midpoint of parent left, midpoint of parent bttom
    // left.setAttributeNS(null, "fill", "black")
    // SVG.appendChild(left)

    // let right = document.createElementNS(SVG_NS, "polygon")
    // right.setAttributeNS(null, "points", `${formula(0,600)},${formula(600,600)} ${formula(300,600)},${formula(0,600)} ${x},${x}`) //midpoint of parent bttom, md parent right, parent right bottom 
    // right.setAttributeNS(null, "fill", "black")
    // SVG.appendChild(right)

    topTriangle(top,counter, 1)
    leftTriangle(top, counter, 1)
    rightTriangle(top, counter, 1)

    //create groups within each element 

}

function topTriangle(parent,counter,count){
//should set parents color to grey 
    if(counter == count + 1){
        console.log(counter)
        console.log(count)
        return 
    }

    let SVG = document.querySelector("svg")
    let points = parent.getAttributeNS(null, "points").split(" ")
    let coordinates = []
    console.log(points)
    
    for (let index = 0; index < points.length; index++) {
        let coord = points[index].split(",")
        coordinates.push(parseInt(coord[0]))
        coordinates.push(parseInt(coord[1]))
        
    }

    let element = document.createElementNS(SVG_NS, "polygon")
    element.setAttributeNS(null, "points", `${formula(coordinates[0],coordinates[2])},${formula(coordinates[1],coordinates[3])} ${coordinates[2]},${coordinates[3]} ${formula(coordinates[2],coordinates[4])},${formula(coordinates[3], coordinates[5])} `)
    element.setAttributeNS(null, "fill", "black")
    parent.setAttributeNS(null, "fill", "grey")
    SVG.appendChild(element)
    counter++

    //topTriangle(element,counter,count)
    
}
function leftTriangle(parent,counter,count){
    //should set parents color to grey 
        if(counter == count + 1){
            console.log(counter)
            console.log(count)
            return 
        }
    
        let SVG = document.querySelector("svg")
        let points = parent.getAttributeNS(null, "points").split(" ")
        let coordinates = []
        console.log(points)
        
        for (let index = 0; index < points.length; index++) {
            let coord = points[index].split(",")
            coordinates.push(parseInt(coord[0]))
            coordinates.push(parseInt(coord[1]))
            
        }
    
        let element = document.createElementNS(SVG_NS, "polygon")
        element.setAttributeNS(null, "points", `${coordinates[0]},${coordinates[1]} ${formula(coordinates[0],coordinates[2])},${formula(coordinates[1],coordinates[3])} ${formula(coordinates[0],coordinates[4])},${formula(coordinates[1], coordinates[5])} `)
        element.setAttributeNS(null, "fill", "black")
        parent.setAttributeNS(null, "fill", "grey")
        SVG.appendChild(element)
        counter++
    
        //leftTriangle(element,counter,count)
   
    }

function rightTriangle(parent,counter,count){
    //should set parents color to grey 
        if(counter == count + 1){
            console.log(counter)
            console.log(count)
            return 
        }
    
        let SVG = document.querySelector("svg")
        let points = parent.getAttributeNS(null, "points").split(" ")
        let coordinates = []
        console.log(points)
        
        for (let index = 0; index < points.length; index++) {
            let coord = points[index].split(",")
            coordinates.push(parseInt(coord[0]))
            coordinates.push(parseInt(coord[1]))
            
        }
    
        let element = document.createElementNS(SVG_NS, "polygon")
        element.setAttributeNS(null, "points", `${formula(coordinates[0],coordinates[4])},${formula(coordinates[1], coordinates[5])} ${formula(coordinates[2],coordinates[4])},${formula(coordinates[3],coordinates[5])} ${coordinates[4]},${coordinates[5]}`)
        element.setAttributeNS(null, "fill", "black")
        parent.setAttributeNS(null, "fill", "grey")
        SVG.appendChild(element)
        counter++
        //rightTriangle(element,counter,count)
    
    }

function formula(p1, p2){
    return (p1 + p2)/2
}