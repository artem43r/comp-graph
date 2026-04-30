const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let angle = 0;
let rotating = true;

let lightPos = new Vector3(2, 2, 2);
const cameraPos = new Vector3(0, 0, 5);

const cube = new Cube();

// простая перспектива
function project(v) {
const z = v.z + 5;
const f = 200 / z;
return {
x: canvas.width / 2 + v.x * f,
y: canvas.height / 2 - v.y * f,
z: z
};
}

// вращение
function rotate(v, ax, ay, az) {
let x = v.x, y = v.y, z = v.z;


// X
let cos = Math.cos(ax), sin = Math.sin(ax);
let y1 = y * cos - z * sin;
let z1 = y * sin + z * cos;

// Y
cos = Math.cos(ay); sin = Math.sin(ay);
let x2 = x * cos + z1 * sin;
let z2 = -x * sin + z1 * cos;

// Z
cos = Math.cos(az); sin = Math.sin(az);
let x3 = x2 * cos - y1 * sin;
let y3 = x2 * sin + y1 * cos;

return new Vector3(x3, y3, z2);


}

// освещение Фонга
function phong(normal, pos) {
const N = normal.normalize();
const L = lightPos.subtract(pos).normalize();
const V = cameraPos.subtract(pos).normalize();


const diff = Math.max(0, N.dot(L));

const R = N.multiply(2 * N.dot(L)).subtract(L).normalize();
const spec = Math.pow(Math.max(0, R.dot(V)), 32);

return 0.2 + 0.7 * diff + 0.8 * spec;


}

function drawTriangle(p1, p2, p3, color) {
ctx.beginPath();
ctx.moveTo(p1.x, p1.y);
ctx.lineTo(p2.x, p2.y);
ctx.lineTo(p3.x, p3.y);
ctx.closePath();
ctx.fillStyle = color;
ctx.fill();
}

// основной рендер
function render() {
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);


const tris = cube.triangulate();

tris.forEach(tri => {
    const v1 = rotate(cube.vertices[tri.vertices[0]], angle, angle, angle);
    const v2 = rotate(cube.vertices[tri.vertices[1]], angle, angle, angle);
    const v3 = rotate(cube.vertices[tri.vertices[2]], angle, angle, angle);

    const normal = tri.normal;

    const center = new Vector3(
        (v1.x + v2.x + v3.x) / 3,
        (v1.y + v2.y + v3.y) / 3,
        (v1.z + v2.z + v3.z) / 3
    );

    const intensity = phong(normal, center);

    const r = parseInt(tri.color.slice(1,3),16) * intensity;
    const g = parseInt(tri.color.slice(3,5),16) * intensity;
    const b = parseInt(tri.color.slice(5,7),16) * intensity;

    const color = `rgb(${r},${g},${b})`;

    const p1 = project(v1);
    const p2 = project(v2);
    const p3 = project(v3);

    drawTriangle(p1, p2, p3, color);
});


}

function animate() {
if (rotating) angle += 0.02;
render();
requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
const rect = canvas.getBoundingClientRect();


const x = (e.clientX - rect.left) / rect.width * 4 - 2;
const y = -(e.clientY - rect.top) / rect.height * 4 + 2;

lightPos = new Vector3(x, y, 2);


});

animate();
