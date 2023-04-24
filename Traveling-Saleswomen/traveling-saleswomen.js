

const SVG = document.getElementById("dot-box")
const ns = "http://www.w3.org/2000/svg";

SVG.addEventListener("click", createCircles)


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
    e.stopPropagation() //may not be necessary
    circle.addEventListener("click", selected)

}

let circle_one = false

let selected_circles = []
let line_arr = []

/*

allow adding new nodes 

prevent there from being multiple lines between nodes

save a previous graph 

create adjacency list for nodes and line connecting nodes

*/
let to_remove; 
function selected(e) {
    if (selected_circles.includes(e.target)) {
        line_arr.pop()
        selected_circles.pop()
        e.target.setAttributeNS(null, "fill", "black")
        to_remove = e.target
        return
    }
    if(to_remove == e.target){
        SVG.removeChild(e.target)
        return
        //remove lines connected to the circle
        //add SVG eventlistener back
    }
   
    selected_circles.push(e.target)
    let rect = SVG.getBoundingClientRect();
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    SVG.removeEventListener("click", createCircles)
    e.target.setAttributeNS(null, "fill", "pink")
    to_remove = null

    if (line_arr.length == 0) {
        let line = document.createElementNS(ns, "line")
        line.setAttributeNS(null, "x1", x)
        line.setAttributeNS(null, "y1", y)
        line.setAttributeNS(null, "stroke", "pink")
        line.setAttributeNS(null, "stroke-width", '5')
        line.addEventListener("click", ()=>{
            SVG.removeEventListener("click", createCircles)
            SVG.removeChild(line)
        })
        line_arr.push(line)
    
    } else {
        let line = line_arr.pop()
        line.setAttributeNS(null, "x2", x)
        line.setAttributeNS(null, "y2", y)

        for (let index = selected_circles.length; index >= 0; index--) {
            SVG.insertBefore(line, selected_circles[index]) //fix. is it when that node is already connected by a line that there is a problem?
            
        }
     
        setTimeout(() => {
            selected_circles.pop().setAttributeNS(null, "fill", "black")
            selected_circles.pop().setAttributeNS(null, "fill", "black")
        }, 500)

    }


}

/*






*/