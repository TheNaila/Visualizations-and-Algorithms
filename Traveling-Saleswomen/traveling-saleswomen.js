const SVG = document.getElementById("dot-box")
const ns = "http://www.w3.org/2000/svg";
SVG.addEventListener("click", createCircles)

const lines_gp = document.getElementById("lines_gp")

let id = 0

//allow users to start adding weights 
const add_weights = document.getElementById("add_weights")
add_weights.innerHTML = "Add Weights"
add_weights.addEventListener("click", strt_add_weights)

//allow users to create more circles when button created
const more_nodes = document.getElementById("more_nodes")

//!make directed edges different weights 
//! if theres an edge  without a weight, set it to infinity 
//!divide by half 
class Graph {
    nodes = []
    edges = []

    constructor() { }
    addNode = function (node) {
        this.nodes.push(node)

    }
    foundEdge(circle1, circle2) {
        for (let index = 0; index < this.nodes.length; index++) {
            if (this.nodes[index].value == circle1) {
                for (const [key, value] of this.nodes[index].neighbors) {
                    if (key.value == circle2) {
                        return true
                    }
                }

            }

        }
        return false
    }
}

class Node {
    id = null
    circle_ref = null
    neighbors = new Map()
    line_weights = new Map()

    constructor(circle) {
        this.circle_ref = circle
    }

    addNeighbor = function (node, edge) {
        this.neighbors.set(node, edge)
    }

    addWeight = function (node, num) {
        this.line_weights.set(node, num)
    }
    setID(id){
        if(this.id == null){
            this.id = id
        }
       
    }
}

//adjacency list
let graph = new Graph()

more_nodes.innerHTML = "Add More Nodes"
more_nodes.addEventListener("click", () => {
    //!
    print_adj_list()
    SVG.addEventListener("click", createCircles)
})



//create circles with a center where the user clicked on the SVG 
function createCircles(e) {
    let rect = SVG.getBoundingClientRect();

    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    let circle = document.createElementNS(ns, "circle")
    circle.setAttributeNS(null, "cx", x)
    circle.setAttributeNS(null, "cy", y)
    circle.setAttributeNS(null, "r", 15)
    circle.classList.add("circles")
    SVG.appendChild(circle)
    e.stopPropagation()

    //listen for when the circle is clicked
    circle.addEventListener("click", selected)

}
//the two circles selected for which a line will be drawn connecting them.will only ever have two elements 
let selected_circles = []
//holds reference to the current line being contemplated
let line_arr = []

function line_funct(e) {
    SVG.removeEventListener("click", createCircles)
    //check if adding to empty 
    for (let index = 0; index < graph.nodes.length; index++) {
        for (const [key, value] of graph.nodes[index].neighbors) {
            if (value == e.target) {
                graph.nodes[index].neighbors.delete(key)
            }
        }

    }
    lines_gp.removeChild(e.target)
}

let to_remove;


//! resolve the case that a circle is selected and then a button is clicked
function selected(e) {

    //checks if the circle was clicked twice in a row 
    if (selected_circles.includes(e.target)) {
        line_arr.pop()
        selected_circles.pop()
        e.target.setAttributeNS(null, "fill", "black")

        //prime it for removal if its clicked again 
        to_remove = e.target
        return
    }

    //if circle is clicked thrice in a row, remove it 
    if (to_remove == e.target) {
        for (let index = 0; index < graph.nodes.length; index++) {
            if (graph.nodes[index].circle_ref == e.target) { //node to be deleted 
                console.log("node: ", e.target)
                for (let [key, value] of graph.nodes[index].neighbors.entries()) { //neighbors and connected lines to node to be deleted
                   key.neighbors.delete(graph.nodes[index]) //remove me + line from neighbors adj
                   lines_gp.removeChild(value) // remove line from svg
                   graph.nodes[index].neighbors.delete(key) //remove all neighbors from node
                }

                graph.nodes.splice(index, 1)

            }

        }

        SVG.removeChild(e.target)
        return
    }

    selected_circles.push(e.target)
    let rect = SVG.getBoundingClientRect();

    let x = e.target.getAttributeNS(null, "cx")
    let y = e.target.getAttributeNS(null, "cy")

    SVG.removeEventListener("click", createCircles)
    e.target.setAttributeNS(null, "fill", "pink")
    to_remove = null

    if (line_arr.length == 0) {
        let line = document.createElementNS(ns, "line")
        line.setAttributeNS(null, "x1", x)
        line.setAttributeNS(null, "y1", y)
        line.setAttributeNS(null, "stroke", "pink")
        line.setAttributeNS(null, "stroke-width", '5')

        line.addEventListener("click", line_funct)
        line_arr.push(line)

    } else {

        //creates a line when two circles are selected
        let line = line_arr.pop()

        let circle1 = selected_circles.pop()
        let circle2 = selected_circles.pop()

        if (graph.foundEdge(circle1, circle2)) {
            circle1.setAttributeNS(null, "fill", "black")
            circle2.setAttributeNS(null, "fill", "black")
            console.log("edge already exists")
            return
        }


        line.setAttributeNS(null, "x2", x)
        line.setAttributeNS(null, "y2", y)
        lines_gp.append(line)


        circle1.setAttributeNS(null, "fill", "black")
        circle2.setAttributeNS(null, "fill", "black")

        let circle1_node = new Node(circle1)
        let circle2_node = new Node(circle2)

        for (let index = 0; index < graph.nodes.length; index++) {
            if(graph.nodes[index].circle_ref == circle1 ){
                for (let i = 0; i < graph.nodes.length; i++) {
                    if(graph.nodes[i].circle_ref == circle2){
                        graph.nodes[index].addNeighbor(graph.nodes[i], line)
                        graph.nodes[i].addNeighbor(graph.nodes[index], line)
                        return
                    }
                    circle2_node.addNeighbor(graph.nodes[index], line) 
                    graph.addNode(circle2_node)
                    graph.nodes[index].addNeighbor(circle2_node, line)
                    return 

                }
            }
            if(graph.nodes[index].circle_ref == circle2 ){
                for (let i = 0; i < graph.nodes.length; i++) {
                    if(graph.nodes[i].circle_ref == circle1){
                        graph.nodes[index].addNeighbor(graph.nodes[i], line)
                        graph.nodes[i].addNeighbor(graph.nodes[index], line)
                        return
                    }
                    circle1_node.addNeighbor(graph.nodes[index], line)
                    graph.addNode(circle1_node)
                    graph.nodes[index].addNeighbor(circle1_node, line)
                    return 

                }
            }
            
        }
       circle1_node.addNeighbor(circle2_node, line) 
       circle2_node.addNeighbor(circle1_node, line)
       graph.addNode(circle1_node)
       graph.addNode(circle2_node)
       

    }

}

function line_selected(e) {
    let html_bd = document.querySelector("body")
    let prompt = window.prompt("Enter a value for the selected edge")

    let rect = SVG.getBoundingClientRect();

    let x1 = parseInt(e.target.getAttributeNS(null, "x1"))

    let y1 = parseInt(e.target.getAttributeNS(null, "y1"))

    let x2 = parseInt(e.target.getAttributeNS(null, "x2"))

    let y2 = parseInt(e.target.getAttributeNS(null, "y2"))

    let weight_txt = document.createElementNS(ns, "text")
    weight_txt.setAttributeNS(null, "x", ((x1 + x2) / 2) + 5)
    weight_txt.setAttributeNS(null, "y", (y1 + y2) / 2)
    weight_txt.setAttributeNS(null, "font-size", 16)
    weight_txt.setAttributeNS(null, "font-size", 16)
    weight_txt.setAttributeNS(null, "font-weight", "bold")


    weight_txt.innerHTML = prompt

    for (let index = 0; index < graph.nodes.length; index++) {
        for (const [key, value] of graph.nodes[index].neighbors) {
            if (value == e.target) {
                key.addWeight(graph.nodes[index], parseInt(prompt))
                graph.nodes[index].addWeight(key, parseInt(prompt))
            }
        }

    }

    SVG.appendChild(weight_txt)

}


function strt_add_weights(e) {

    let lines = document.querySelectorAll("line")
    console.log(lines)
    SVG.removeEventListener("click", createCircles)

    for (let index = 0; index < lines.length; index++) {
        lines[index].removeEventListener("click", line_funct)
        lines[index].addEventListener("click", line_selected)

    }

}

function solve() {

}

function print_adj_list(){
for (let index = 0; index < graph.nodes.length; index++) {
    graph.nodes[index].setID(index)
    
}
for (let index = 0; index < graph.nodes.length; index++) {
    let str = graph.nodes[index].id + " : "
        for (const [key, value] of graph.nodes[index].neighbors ) {
            str += key.id + " "
        }
        console.log(str)
    }
    
}

//!put adjancy matrix on screen 
//allow deletion through matrix