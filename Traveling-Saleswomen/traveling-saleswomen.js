/*

make sure that the event listener isn't propogrted to children 

add event listener to every circle so that we can know if they are clicked

if same circle clicked twice, remove highight/remove from consideration

if two circles clicked consecutively, draw a line between them 

if click line and click delete then remove line
 */

const SVG = document.getElementById("dot-box")
const ns = "http://www.w3.org/2000/svg";

SVG.addEventListener("click", createCircles)
console.log(SVG)


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


ensure the lines are added under the circles

allow removing lines 

prevent there from being multiple lines between nodes

allow adding new circles after lines
*/
function selected(e) {
    if (selected_circles.includes(e.target)) {
        line_arr.pop()
        console.log(e.target)
        selected_circles.pop()
        e.target.setAttributeNS(null, "fill", "black")
        return
    }

    selected_circles.push(e.target)
    let rect = SVG.getBoundingClientRect();
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    SVG.removeEventListener("click", createCircles)
    e.target.setAttributeNS(null, "fill", "pink")

    if (line_arr.length == 0) {
        let line = document.createElementNS(ns, "line")
        line.setAttributeNS(null, "x1", x)
        line.setAttributeNS(null, "y1", y)
        line.setAttributeNS(null, "stroke", "pink")
        line.setAttributeNS(null, "stroke-width", '5')
        line_arr.push(line)
    

    } else {
        let line = line_arr.pop()
        line.setAttributeNS(null, "x2", x)
        line.setAttributeNS(null, "y2", y)
        SVG.appendChild(line)
        setTimeout(() => {
            selected_circles.pop().setAttributeNS(null, "fill", "black")
            selected_circles.pop().setAttributeNS(null, "fill", "black")
            SVG.addEventListener("click", createCircles)
        }, 500)

    }
    //! what happens when a circle is clicked more than twice

}

