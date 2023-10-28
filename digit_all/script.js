const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
let drawing = false;
let penSize = 20; // Set the initial pen size

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        ctx.lineWidth = penSize; // Set the pen size
        ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
});

// Function to change the pen size
function changePenSize(size) {
    penSize = size;
}

const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
});
