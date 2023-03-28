const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

const SVG = document.getElementById("convex-hull-box");
SVG.setAttributeNS(SVG_NS,"width", SVG_WIDTH)
SVG.setAttributeNS(null, "height", SVG_HEIGHT)
let pointSet = new PointSet()
SVG.addEventListener("click", createPoint)


let circles = [] 
//need an array of the circle refs themselves because when we add the points to pointset all we are doing is adding the x and y coordinates and creating a new object
//We want to retain access to the circle object

let lineStack = []
//stack of all our lines

let stack = []
//Convex Hull points stack 

function createPoint(e){

rect = SVG.getBoundingClientRect(); 
//ensures that we are getting the circle element coordinates relative to our viewport and not the page 
let x = e.clientX - rect.left
let y = e.clientY - rect.top
let circle = document.createElementNS(SVG_NS,"circle"); 
circle.classList.add("circle"); 
circle.setAttributeNS(null, "cy", y)
circle.setAttributeNS(null, "cx", x)
circle.setAttributeNS(null, "r",5)
//adding the circle to the page and the points []
SVG.appendChild(circle)
pointSet.addNewPoint(x,y)
}

let startbtn = document.getElementById("start-btn")
startbtn.addEventListener("click", startConvexHull)

function startConvexHull(){

circles = document.getElementsByTagNameNS(SVG_NS,"circle")
SVG.removeEventListener("click", createPoint)
pointSet.sort()
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


function rightTurn(pt, pt1, pt2){
  
   let x = pt.getAttributeNS(null, "cx")
   let y = pt.getAttributeNS(null, "cy")
   let x1 = pt1.getAttributeNS(null, "cx")
   let y1 = pt1.getAttributeNS(null, "cy")
   let x2 = pt2.getAttributeNS(null, "cx")
   let y2 = pt2.getAttributeNS(null, "cy")
   let value = (( x - x1 ) * (y2 - y1)) - ((y - y1) * (x2 - x1))

    if(value > 0){
        console.log(false)
        console.log(value)
        return false ///postive --> on the left side
    }
    console.log(true)
    return true

}

let firstStep = true
let pointerID = 2

function continueConvexHull(){

    if(firstStep)
    {
    drawLineSegment(stack[0], stack[1])
    firstStep = false
    console.log(0, 1)
    }
    else{
    
    let nextID =  pointSet.points[pointerID].id
    let cur = circles[nextID]

    let parent = stack.pop() 
    let grandparent = stack.pop()
    
    console.log(parent,cur)
    console.log("Parent:", parent.getAttributeNS(null, "cx"))
    console.log("Cur:", cur.getAttributeNS(null, "cx"))
    

    if(!rightTurn(cur, grandparent, parent)){
        stack.push(grandparent) 
        stack.push(cur)
        //let line1 = lineStack.pop()
       // SVG.removeChild(line1)
        let line2 = lineStack.pop()
        SVG.removeChild(line2)
        //make bad line varying shades of red
        drawLineSegment(grandparent, cur)
       
    }
    else{

        stack.push(parent)
        stack.push(cur)
        drawLineSegment(parent, cur)
    }
    pointerID++
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