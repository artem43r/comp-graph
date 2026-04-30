const canvas = document.getElementById('canvas');
const renderer = new ShadedRenderer(canvas);
const cube = new Cube();

let rotating = false;

let angleX = 0;
let angleY = 0;
let angleZ = 0;

let speedX = 0.02;
let speedY = 0.02;
let speedZ = 0.02;

// Ползунки
document.getElementById('speedX').oninput = e => speedX = parseFloat(e.target.value);
document.getElementById('speedY').oninput = e => speedY = parseFloat(e.target.value);
document.getElementById('speedZ').oninput = e => speedZ = parseFloat(e.target.value);

function animate() {
if (rotating) {
angleX += speedX;
angleY += speedY;
angleZ += speedZ;


    renderer.setRotation(angleX, angleY, angleZ);
}

renderer.render(cube);

requestAnimationFrame(animate);


}

document.getElementById('rotateBtn').addEventListener('click', () => {
rotating = !rotating;
});

document.getElementById('resetBtn').addEventListener('click', () => {
rotating = false;
angleX = angleY = angleZ = 0;
renderer.setRotation(0, 0, 0);
});

document.getElementById('projectionSelect').addEventListener('change', (e) => {
const aspect = canvas.width / canvas.height;


if (e.target.value === 'perspective') {
    renderer.projectionMatrix = Matrix4.perspective(Math.PI / 3, aspect, 0.1, 100);
} else {
    renderer.projectionMatrix = Matrix4.orthographic(-2, 2, -2, 2, 0.1, 100);
}


});

animate();
