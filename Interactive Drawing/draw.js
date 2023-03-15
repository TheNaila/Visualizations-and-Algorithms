const ns = "http://www.w3.org/2000/svg";

const box = document.querySelector("#dot-box");
box.addEventListener("click", clickBox);
firstClick = false
let rect; 
let line; 


function clickBox(e) {
    const svg = document.querySelector("svg")

    if(!firstClick){

    rect = box.getBoundingClientRect(); 
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    const para = document.querySelector("#text-box");

    let circle = document.createElementNS(ns, "circle")
    circle.classList.add("flash-circle")
    circle.setAttributeNS(null, "cy", y) //relative to the parent element aka the whole page 
    circle.setAttributeNS(null, "cx",x)
    circle.setAttributeNS(null, "r",20)
    svg.appendChild(circle)
    //svg.removeChild(circle)
    line = document.createElementNS(ns,"line")
    //line needs to start at center of circle
    line.setAttributeNS(null,"x1", x)
    line.setAttributeNS(null,"y1",y)
    line.setAttributeNS(null, "stroke", "black")
    line.setAttributeNS(null, "stroke-width", '5')
    firstClick = true
    box.addEventListener("mousemove", movingLine);
  
    }else{
        box.removeEventListener("mousemove", movingLine)
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top
        line.setAttributeNS(null, "x2", x)
        line.setAttributeNS(null, "y2", y)
        svg.appendChild(line)
        firstClick = false
    
    }
}

function movingLine(e){
    let circle = document.querySelector("circle")
    rect = box.getBoundingClientRect(); 
    const svg = document.querySelector("svg")
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    line.setAttributeNS(null, "x2", x)
    console.log(line)
    line.setAttributeNS(null, "y2", y)
    if(circle != null){
    svg.removeChild(circle)
    }
    svg.appendChild(line)
    

}

