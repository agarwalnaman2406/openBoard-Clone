let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color")
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width"); 
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let mousedown = false;

// API
let tool = canvas.getContext("2d");
let unodRedoTracker = []; //Data
let track = 0; // Represent which action from tracker Array

tool.strokeStyle = "red";
tool.lineWidth = "3";

// tool.beginPath(); // new graphic (path) (line)
// tool.moveTo(10,10); // start point
// tool.lineTo(100,150); // end point
// tool.stroke(); // fill colour

// mousedown -> start new path
// mousemove -> path fill (graphics)

canvas.addEventListener("mousedown", (e)=>{
    mousedown = true
    beginPath({
        x: e.clientX,
        y: e.clientY
    })
})

canvas.addEventListener("mousemove", (e) => {
    if(mousedown){
        drawStroke({
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        })
    }
})

canvas.addEventListener("mouseup", (e) => {
    mousedown = false;
    let url = canvas.toDataURL();
    unodRedoTracker.push(url);
    track = unodRedoTracker.length - 1;
})

function beginPath(){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem)=>{
    colorElem.addEventListener("click", (e)=>{
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e)=>{
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change", (e)=>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e)=>{
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpeg";
    a.click();
})

undo.addEventListener("click", (e)=>{
    if(track > 0) track--;
    undoRedoCanvas({
        trackValue: track,
        unodRedoTracker
    });
})

redo.addEventListener("click", (e)=>{
    if(track < unodRedoTracker.length -1) track++;
    // action
    undoRedoCanvas({
        trackValue: track,
        unodRedoTracker
    });
})

function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    unodRedoTracker = trackObj.unodRedoTracker;

    let url = unodRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}



