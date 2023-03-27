const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;


const SVG = document.getElementById("convex-hull-box");
SVG.setAttributeNS(SVG_NS,"width", SVG_WIDTH)
SVG.setAttributeNS(null, "height", SVG_HEIGHT)
SVG.addEventListener("click", createPoint)
let pointSet = new PointSet()
//!
// Test()

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.

let circles = []
let lineStack = []

function createPoint(e){
console.log("Click position", e.clientY)

rect = SVG.getBoundingClientRect(); 
console.log("Rect top", rect.top)
let x = e.clientX - rect.left
let y = e.clientY - rect.top
let circle = document.createElementNS(SVG_NS,"circle"); 
circle.classList.add("circle"); 
circle.setAttributeNS(null, "cy", y) //relative to the parent element aka the whole page 
circle.setAttributeNS(null, "cx", x)
circle.setAttributeNS(null, "r",5)
SVG.appendChild(circle)
pointSet.addNewPoint(x,y)


}

let stack = []

let startbtn = document.getElementById("start-btn")
startbtn.addEventListener("click", startConvexHull)

function startConvexHull(){
//need an array of the circle refs themselves because when we add the points to pointset all we are doing is adding the x and y coordinates and creating a new object
//We want to retain access to the circle object
circles = document.getElementsByTagNameNS(SVG_NS,"circle")
SVG.removeEventListener("click", createPoint)
pointSet.sort()
//! 
console.log(pointSet.getXCoords())

let leftMost = pointSet.points[0]
let secondElement = pointSet.points[1]
//we can index by the id of the points because the ids are the insert order and its the same order of the elements in the array of circle elements
let circle = circles[leftMost.id]
circle.setAttributeNS(null,"fill", "red")
stack.push(circle)
stack.push(circles[secondElement.id])
}

let stepbtn = document.getElementById("step-btn")
stepbtn.addEventListener("click", continueConvexHull)

let pointSetInd = 2
let pointer1 = 1
let pointer2 = 2
let firstStep = true

// function Test(){
//     let circle = document.createElementNS(SVG_NS, "circle")
//     let circle1 = document.createElementNS(SVG_NS, "circle")
//     let circle2 = document.createElementNS(SVG_NS, "circle")

//     circle.setAttributeNS(null, "cx", 2);
//     circle.setAttributeNS(null, "cy", 13);

//     circle1.setAttributeNS(null, "cx", 1);
//     circle1.setAttributeNS(null, "cy", 11);
    
//     circle2.setAttributeNS(null, "cx", 3);
//     circle2.setAttributeNS(null, "cy", 11);

//     console.log(rightTurn(circle, circle1, circle2))
// }

function rightTurn(pt, pt1, pt2){
   // pt = (x, y)
   // pt1 = (x1, y1)
   //pt2 = (x2, y2)
   let x = pt.getAttributeNS(null, "cx")
   let y = pt.getAttributeNS(null, "cy")
   let x1 = pt1.getAttributeNS(null, "cx")
   let y1 = pt1.getAttributeNS(null, "cy")
   let x2 = pt2.getAttributeNS(null, "cx")
   let y2 = pt2.getAttributeNS(null, "cy")
    let value = (( x - x1 ) * (y2 - y1)) - ((y - y1) * (x2 - x1))
    if(value > 0){
        console.log(false)
        return false ///postive / on the left side
    }
    console.log(true)
    return true

}
let count = 1
function continueConvexHull(){
    if(firstStep)
    {
    drawLineSegment(stack[0], stack[1])
    firstStep = false
    console.log("segment", count)
    console.log("from", 0, "to", 1)
    count++
   
    }
    else{
    
    
    let nextID =  pointSet.points[pointer2].id
   //indexing pointSet to find the next element, and then using the ID to get the insertion order so that I can index into the circles array 
    stack.push(circles[nextID])
    
    drawLineSegment(stack[pointer1],stack[pointer2])

    console.log("segment", count)
    console.log("from", pointer1, "to", pointer2)
    count++
    
    if(!rightTurn(stack[pointer2], stack[pointer2 - 2], stack[pointer1])){
        console.log("left turn")
        stack.pop()
        setTimeout(() => {
            let badLine = lineStack.pop()
            SVG.removeChild(badLine);
          }, 1000);
    
        
         }
     
    pointer1++
    pointer2++

  
    }


}

function drawLineSegment(pt1, pt2){
let line = document.createElementNS(SVG_NS, "line")
line.setAttributeNS(null, "x1", pt1.getAttributeNS(null, "cx"))
line.setAttributeNS(null, "y1", pt1.getAttributeNS(null, "cy"))
line.setAttributeNS(null, "x2", pt2.getAttributeNS(null, "cx"))
line.setAttributeNS(null, "y2", pt2.getAttributeNS(null, "cy"))
line.setAttributeNS(null, "stroke-width", 2)
line.setAttributeNS(null, "stroke", "black")
SVG.appendChild(line)
lineStack.push(line)
console.log("Drew")

}



function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
	if (this.x > p.x) {
	    return 1;
	}

	if (this.x < p.x) {
	    return -1;
	}

	if (this.y > p.y) {
	    return 1;
	}

	if (this.y < p.y) {
	    return -1;
	}

	return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
	this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
	this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
	let coords = [];
	for (let pt of this.points) {
	    coords.push(pt.x);
	}

	return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
	let coords = [];
	for (pt of this.points) {
	    coords.push(pt.y);
	}

	return coords;
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}


function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // a n svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized

    // COMPLETE THIS OBJECT
}

/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
	
	// COMPLETE THIS METHOD
	
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
	
	// COMPLETE THIS METHOD
	
    }

    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {

	// COMPLETE THIS METHOD
	
    }
}
