const SVG_NS = "http://www.w3.org/2000/svg";
let counter = 0 
initialization()

function initialization(){
    let SVG = document.querySelector("svg")
    let body = document.querySelector("body")

    let res = document.createElement("h3")
    res.innerHTML = "Sources: https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle"
    body.appendChild(res)
    let des = document.createElement("h3")
    des.innerHTML = "Used recursion to create the 3 inner triangles for each triangle using coordinate transformations"
    body.appendChild(des)

    let mainTriangle = document.createElementNS(SVG_NS, "polygon")
    let x = 800
    let midpoint = x/2
    mainTriangle.setAttributeNS(null, "points", `0,${x} ${midpoint},0 ${x},${x}`)
    mainTriangle.setAttributeNS(null, "fill", "grey")
    SVG.appendChild(mainTriangle)

    //3 elements 

    let top = document.createElementNS(SVG_NS, "polygon")
    top.setAttributeNS(null, "points", `${formula(0,midpoint)},${formula(x,0)} ${midpoint},0 ${formula(midpoint,x)},${formula(0,x)}`) //md parent left, parent top, md parent right 
    top.setAttributeNS(null, "fill", "grey")
    SVG.appendChild(top)

    let left = document.createElementNS(SVG_NS, "polygon")
    left.setAttributeNS(null, "points", `0,${x} ${formula(0, midpoint)},${formula(x,0)} ${formula(0,x)},${formula(x,x)}`) //parent bottom left, midpoint of parent left, midpoint of parent bttom
    left.setAttributeNS(null, "fill", "black")
    SVG.appendChild(left)

    let right = document.createElementNS(SVG_NS, "polygon")
    right.setAttributeNS(null, "points", `${formula(0,x)},${formula(x,x)} ${formula(midpoint,x)},${formula(0,x)} ${x},${x}`) //midpoint of parent bttom, md parent right, parent right bottom 
    right.setAttributeNS(null, "fill", "black")
    SVG.appendChild(right)

    let count = 5
    three_triangles(top, counter, count)
    three_triangles(left, counter, count)
    three_triangles(right, counter, count)

    //create groups within each element 

}

function three_triangles(parent,counter,count){
    if(counter == count){
        return 
    }

    let points = parent.getAttributeNS(null, "points").split(" ")
    let coordinates = []
    
    for (let index = 0; index < points.length; index++) {
        let coord = points[index].split(",")
        coordinates.push(parseInt(coord[0]))
        coordinates.push(parseInt(coord[1]))
        
    }
    console.log(coordinates)
    parent.setAttributeNS(null, "fill", "grey")
    let top = triangle(formula(coordinates[0],coordinates[2]), formula(coordinates[1],coordinates[3]), coordinates[2] ,coordinates[3], formula(coordinates[2],coordinates[4]), formula(coordinates[3], coordinates[5]))
    let left = triangle(coordinates[0],coordinates[1], formula(coordinates[0],coordinates[2]), formula(coordinates[1],coordinates[3]), formula(coordinates[0],coordinates[4]), formula(coordinates[1], coordinates[5]))
    let right = triangle(formula(coordinates[0],coordinates[4]), formula(coordinates[1], coordinates[5]), formula(coordinates[2],coordinates[4]), formula(coordinates[3],coordinates[5]), coordinates[4], coordinates[5])
    counter++
    three_triangles(top,counter, count)
    three_triangles(left,counter, count)
    three_triangles(right,counter, count)
}

function triangle(x1,y1,x2,y2,x3,y3){
    let SVG = document.querySelector("svg")
    let element = document.createElementNS(SVG_NS, "polygon")
    element.setAttributeNS(null, "points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`)
    element.setAttributeNS(null, "fill", "black")
    SVG.appendChild(element)
    return element

    
}
function formula(p1, p2){
    return (p1 + p2)/2
}

//TODO: make figure get larger/smaller