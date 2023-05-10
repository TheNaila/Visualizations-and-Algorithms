const SVG = document.getElementById("dot-box")
const ns = "http://www.w3.org/2000/svg";
SVG.addEventListener("click", createCircles)

const lines_gp = document.getElementById("lines_gp")

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

        //!should make it undirected
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
    value = null
    neighbors = new Map()
    line_weights = new Map()

    constructor(value) {
        this.value = value
    }

    addNeighbor = function (node, edge) {
        this.neighbors.set(node, edge)
    }

    addWeight = function (node, num) {
        this.line_weights.set(node, num)
    }
}

//adjacency list
let graph = new Graph()

more_nodes.innerHTML = "Add More Nodes"
more_nodes.addEventListener("click", () => {
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
//hols reference to the current line being contemplated
let line_arr = []

/*

prevent there from being multiple lines between nodes

save a previous graph 

create adjacency list for nodes and line connecting nodes

*/

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
        e.target.setAttributeNS(null, "fill", "red")
        for (let index = 0; index < graph.nodes.length; index++) {
            if (graph.nodes[index].value == e.target) {
                for (const [key, value] of graph.nodes[index].neighbors) {
                    key.neighbors.delete(graph.nodes[index]) //remove node + line from neighbors adj
                    lines_gp.removeChild(graph.nodes[index].neighbors.get(key)) // remove line from svg
                    graph.nodes[index].neighbors.delete(key) //remove all neighbors from node
                }

                graph.nodes.splice(index, 1)

            }

        }
        //! 
    

        SVG.removeChild(e.target)
        return
        //!remove lines connected to the circle
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
            return
        }


        //!will add circles to adj list at this point because its more sure that they are included

        line.setAttributeNS(null, "x2", x)
        line.setAttributeNS(null, "y2", y)
        lines_gp.append(line)


        circle1.setAttributeNS(null, "fill", "black")

        let node = new Node(circle1)
        let neighbor = new Node(circle2)

        circle2.setAttributeNS(null, "fill", "black")
        // check if circle is in adj_list 
        for (let index = 0; index < graph.nodes.length; index++) {
            if (graph.nodes[index].value == circle1) {
                graph.nodes[index].addNeighbor(neighbor, line)
                for (let i = 0; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].value == circle2) {
                        graph.nodes[i].addNeighbor(node, line)
                        return
                    }
                }
                neighbor.addNeighbor(node, line)
                graph.addNode(neighbor)
                return

            }
            if (graph.nodes[index].value == circle2) {
                graph.nodes[index].addNeighbor(node, line)
                for (let i = 0; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].value == circle1) {
                        graph.nodes[i].addNeighbor(neighbor, line)
                        return
                    }
                }
                node.addNeighbor(neighbor, line)
                graph.addNode(node)
                return
            }

        }


        node.addNeighbor(neighbor, line)

        neighbor.addNeighbor(node, line)

        graph.addNode(node)
        graph.addNode(neighbor)
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
    /*
    pre-decide where each number should go to be close to edge but not overlaping others (to the right/center of each edge)
    ---> over 5px or (distance between edge and closest thing to me/2 that is at least 1 pixel from both)
    create alert box
    press numbers
    */
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