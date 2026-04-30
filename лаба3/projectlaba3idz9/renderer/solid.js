// renderer/solid.js
class SolidRenderer extends WireframeRenderer {
constructor(canvas) {
super(canvas);
this.zbuffer = new ZBuffer(canvas.width, canvas.height);
}

// Рисование треугольника с проверкой глубины
drawTriangle(v1, v2, v3, color) {
    // Проецируем вершины
    const p1 = this.project(v1);
    const p2 = this.project(v2);
    const p3 = this.project(v3);

    if (!p1 || !p2 || !p3) return;

    // Bounding box
    const minX = Math.max(0, Math.floor(Math.min(p1.x, p2.x, p3.x)));
    const maxX = Math.min(this.width - 1, Math.ceil(Math.max(p1.x, p2.x, p3.x)));

    const minY = Math.max(0, Math.floor(Math.min(p1.y, p2.y, p3.y)));
    const maxY = Math.min(this.height - 1, Math.ceil(Math.max(p1.y, p2.y, p3.y)));

    // Функция ребра
    const edge = (a, b, c) => {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    };

    const area = edge(p1, p2, p3);
    if (Math.abs(area) < 0.0001) return;

    // Проход по пикселям
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const p = { x, y };

            const w0 = edge(p2, p3, p);
            const w1 = edge(p3, p1, p);
            const w2 = edge(p1, p2, p);

            const alpha = w0 / area;
            const beta = w1 / area;
            const gamma = w2 / area;

            if (alpha >= 0 && beta >= 0 && gamma >= 0) {
                // Интерполяция глубины
                const z = alpha * p1.z + beta * p2.z + gamma * p3.z;

                // Z-buffer
                if (this.zbuffer.testAndSet(x, y, z)) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
}

render(cube) {
    // Очистка
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.zbuffer.clear();

    // Получаем треугольники
    const triangles = cube.triangulate();

    // Рисуем треугольники
    triangles.forEach(tri => {
        const v1 = cube.vertices[tri.vertices[0]];
        const v2 = cube.vertices[tri.vertices[1]];
        const v3 = cube.vertices[tri.vertices[2]];

        this.drawTriangle(v1, v2, v3, tri.color);
    });
}


}
