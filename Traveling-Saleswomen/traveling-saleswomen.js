const SVG = document.getElementById("dot-box")
const ns = "http://www.w3.org/2000/svg";
SVG.addEventListener("click", createCircles)

const lines_gp = document.getElementById("lines_gp")

//allows users to see the adj list when the btn is clicked 
const show_adj_list = document.getElementById("show_adj_list")
show_adj_list.innerHTML = "Show Adjacency List"
show_adj_list.style.marginLeft = "25px"
show_adj_list.classList.add("btn")
show_adj_list.addEventListener("click", print_adj_list)

//allow users to create more circles when button created
const more_nodes = document.getElementById("more_nodes")

class Graph {
    nodes = []
    edges = []

    constructor() { }
    addNode = function (node) {
        this.nodes.push(node)

    }
    //returns true if edge is already in adj matrix
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
//A node is a vertex, each vertex has a map of "neighbors" as keys, and the line that connects them as values

class Node {
    id = null
    circle_ref = null
    neighbors = new Map()

    constructor(circle) {
        this.circle_ref = circle
    }

    addNeighbor = function (node, edge) {
        this.neighbors.set(node, edge)
    }

    setID(id) {
        this.id = id

    }
    getRef = function () {
        return this.circle_ref
    }
}

//adjacency list
let graph = new Graph()

//button that allows nodes to be added after users begin manipulating edges. Otherwise after setting edges, users cant add more nodes
more_nodes.innerHTML = "Add More Nodes"

more_nodes.classList.add("btn")

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
    let node = new Node(circle)
    graph.nodes.push(node)

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
                key.neighbors.delete(key)
                graph.nodes[index].neighbors.delete(key)
            }
        }

    }
    lines_gp.removeChild(e.target)
}

let to_remove;


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
            return
        }

        line.setAttributeNS(null, "x2", x)
        line.setAttributeNS(null, "y2", y)
        lines_gp.append(line)

        circle1.setAttributeNS(null, "fill", "black")
        circle2.setAttributeNS(null, "fill", "black")

        //checks whether or not nodes are already present in the adjancy matrix and adds them accordingly

        let circle1_node = new Node(circle1)
        let circle2_node = new Node(circle2)

        for (let index = 0; index < graph.nodes.length; index++) {
            if (graph.nodes[index].circle_ref == circle1) {
                for (let i = 0; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].circle_ref == circle2) {

                        graph.nodes[index].addNeighbor(graph.nodes[i], line)
                        graph.nodes[i].addNeighbor(graph.nodes[index], line)
                        return
                    }
                }
            }
            if (graph.nodes[index].circle_ref == circle2) {
                for (let i = 0; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].circle_ref == circle1) {

                        graph.nodes[index].addNeighbor(graph.nodes[i], line)
                        graph.nodes[i].addNeighbor(graph.nodes[index], line)

                        return
                    }
                }
            }

        }

    }
}


let start = false

let bfs = document.getElementById("bfs")
bfs.classList.add("btn")
bfs.innerHTML = "Traverse BFS"
bfs.style.marginLeft = "25px"
bfs.addEventListener("click", bfs_alg)

let current_ind = 1
let queue = []
let added = []

function bfs_alg() {

    //removing relevant eventListeners
    if (graph.nodes.length > 0) {
        SVG.removeEventListener("click", createCircles)
        more_nodes.disabled = true
        more_nodes.style.backgroundColor = "grey"
        more_nodes.style.textDecoration = "none"

        for (let index = 0; index < lines_gp.children.length; index++) {
            lines_gp.children[index].removeEventListener("click", line_funct)

        }
    }

    let current_node = null


    if (graph.nodes.length == 0) {
        alert("Please add nodes and edges to get started")
        return
    }
    
    if (current_ind == queue.length) {
        if (queue.length < graph.nodes.length) {
            alert("Looks like one or more nodes may not have an edge. Run BFS again for another possible traversal or add more edges")
        }
        else {
            alert("You've reached the end of the BFS. Refresh the page to create and visualize more graphs")
        }
    }

    //starting node
    if (!start) {
        let current_ind = Math.floor(Math.random() * graph.nodes.length)
        current_node = graph.nodes[current_ind]
        current_node.circle_ref.setAttributeNS(null, "fill", "red")
        start = true

        queue.push([current_node.getRef(), 0, 0])


        //first node is processed 
        for (const [key, value] of current_node.neighbors.entries()) {
            queue.push([key.getRef(), key, value])

        }

        return
    }

    current_node = queue[current_ind]
    current_node[0].setAttributeNS(null, "fill", "red")
    current_node[2].setAttributeNS(null, "stroke", "red")
    // //process current node
    current_ind++


    for (const [key, value] of current_node[1].neighbors.entries()) {
        let ignore = false
        for (let index = 0; index < queue.length; index++) {
            if (queue[index][0] == key.getRef()) {
                ignore = true
            }
        }

        if (!ignore) {
            queue.push([key.getRef(), key, value])
        }

    }

}

let need_update = false
let html_bd = document.querySelector("body")
let adj_table = document.createElement("table")

function print_adj_list() {
    if (need_update == true) {

        adj_table.innerHTML = ""

    }

    //assigns id to nodes and prints adj matrix
    need_update = true
    for (let index = 0; index < graph.nodes.length; index++) {
        graph.nodes[index].setID(index)
        graph.nodes[index].circle_ref.innerHTML = index

    }

    let th_row = document.createElement("tr")

    let col_1 = document.createElement("th")
    col_1.innerHTML = "Vertex"
    col_1.style.width = "100px"

    let col_2 = document.createElement("th")
    col_2.innerHTML = "Neighbors"

    th_row.appendChild(col_1)
    th_row.appendChild(col_2)
    adj_table.appendChild(th_row)

    html_bd.appendChild(adj_table)

    for (let index = 0; index < graph.nodes.length; index++) {
        let row = document.createElement("tr")
        let vertex = document.createElement("td")
        vertex.innerHTML = graph.nodes[index].id
        row.appendChild(vertex)

        let neighbors = document.createElement("td")

        for (const [key, value] of graph.nodes[index].neighbors) {

            let elem = document.createElement("span")
            elem.style.paddingRight = "10px"
            elem.innerHTML = key.id
            neighbors.appendChild(elem)
        }

        row.appendChild(neighbors)
        adj_table.appendChild(row)
    }

}