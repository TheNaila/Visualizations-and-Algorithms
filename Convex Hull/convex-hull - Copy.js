const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

const SVG = document.getElementById("convex-hull-box");
SVG.setAttributeNS(SVG_NS,"width", SVG_WIDTH)
SVG.setAttributeNS(null, "height", SVG_HEIGHT)


let circles = [] 
//need an array of the circle refs themselves because when we add the points to pointset all we are doing is adding the x and y coordinates and creating a new object
//We want to retain access to the circle object

let lineStack = []
//stack of all our lines

let stack = []
//Convex Hull points stack 

let pointSet = new PointSet()

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

function testPoints(x,y){
    let rect = SVG.getBoundingClientRect(); 
    let c1 = document.createElementNS(SVG_NS, "circle")
    c1.classList.add("circle"); 
    c1.setAttributeNS(null, "cx", x)
    c1.setAttributeNS(null, "cy", y)
    c1.setAttributeNS(null, "r",5)
    SVG.appendChild(c1)
    pointSet.addNewPoint(x,y)
    
}
// testPoints(62, 62.125)
// testPoints(64, 213.125)
// testPoints(249, 81.125)
// testPoints(23,140.125)
// testPoints(140, 158.125)
// testPoints(188, 75.125)
// testPoints(259, 211.125)
// testPoints(72, 130.125)
// testPoints(317, 60.125)
// testPoints(178, 231.125)
// testPoints(216,118.125)
// testPoints(500, 109.125) //396
// testPoints(550, 151.125)

function rightTurn(current, parent, grandparent){
    let bx = parent.getAttributeNS(null, "cx")
    let by = parent.getAttributeNS(null, "cy")
    let ax = grandparent.getAttributeNS(null, "cx")
    let ay = grandparent.getAttributeNS(null, "cy")
    let cx = current.getAttributeNS(null, "cx")
    let cy = current.getAttributeNS(null, "cy")
    let vector_u_x = (bx - ax)
    let vector_u_y = (by - ay)
    let vector_v_x = (cx - bx)
    let vector_v_y = (cy - by)
    let vperp_x = (- vector_v_y)
    let vperp_y = (vector_v_x)
    let dot_product = (vperp_x * vector_u_x) + (vperp_y * vector_u_y)
    
    if(dot_product < 0){
        return true
    }
    console.log("false")
    return false
}

let firstStep = true
let pointerID = 2

function rightTurnPS(current, parent, grandparent){
    let bx = parent.x
    let by = parent.y
    let ax = grandparent.x
    let ay = grandparent.y
    let cx = current.x
    let cy = current.y
    let vector_u_x = (bx - ax)
    let vector_u_y = (by - ay)
    let vector_v_x = (cx - bx)
    let vector_v_y = (cy - by)
    let vperp_x = (- vector_v_y)
    let vperp_y = (vector_v_x)
    let dot_product = (vperp_x * vector_u_x) + (vperp_y * vector_u_y)
    
    if(dot_product < 0){
        return true
    }
    console.log("false")
    return false
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

    this.svg.addEventListener("click", createPoint)
    
    // COMPLETE THIS OBJECT
}


/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    //start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
	
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

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
        if(firstStep)
        {
        drawLineSegment(stack[0], stack[1])
        firstStep = false
        }
        else{

            let current = pointSet.points[pointerID].id
            current = circles[current]

            let parent = stack[stack.length - 1]
            let grandparent = stack[stack.length - 2]

            
            while (grandparent != null && !rightTurn(current, parent, grandparent)){
                stack.pop()
                let line = lineStack.pop()
                SVG.removeChild(line)
            
                parent = stack[stack.length - 1]

                let gid = stack.length - 2
                if(gid >= 0){
                grandparent = stack[gid]
                }else{
                   grandparent = null 
                }
        
            }
            
        
            stack.push(current)
            drawLineSegment(current, parent)
    

            pointerID++
           
            if(pointerID == pointSet.points.length){
                console.log(stack)
                pointSet.points.reverse()
                let rightMost = pointSet.points[0].id
                //we can index by the id of the points because the ids are the insert order and its the same order of the elements in the array of circle elements
                let lowerCFirst = circles[rightMost]
                lowerCFirst.setAttributeNS(null,"fill", "red")

                let secondElementID = pointSet.points[1].id
                let secondElement = circles[secondElementID]
                secondElement.setAttributeNS(null,"fill", "blue")
                pointerID = 2
               
            
            }
            
        }
    
	
    }

    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {

        
       let stackPS = []
       
       this.ps.sort()
       let points = this.ps.points
       stackPS.push(points[0])
       stackPS.push(points[1])
       
       let lowerC = false
       
       for (let index = 2; index < points.length; index++) {
         let parent = stackPS[stackPS.length - 1]
         let grandparent = stackPS[stackPS.length - 2]
         let current = points[index]


         while(grandparent != null && !rightTurnPS(current, parent, grandparent)){
            stackPS.pop()
            parent = stackPS[stackPS.length - 1]

            let gid = stackPS.length - 2
            if(gid >= 0){
            grandparent = stackPS[gid]
            }else{
               grandparent = null 
            }
            
         }
         
         stackPS.push(current)
         
        if(!lowerC && index == points.length - 1){
            index = 2
            this.ps.reverse()
            points = this.ps.points
            lowerC = true
        }
         
       }

       console.log("stackPS", stackPS)
       
    }
}
let cv = new ConvexHull(pointSet, new ConvexHullViewer(SVG, pointSet))
cv.getConvexHull()

let startbtn = document.getElementById("start-btn")
startbtn.addEventListener("click", cv.start)

let stepbtn = document.getElementById("step-btn")
stepbtn.addEventListener("click", cv.step)

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
}