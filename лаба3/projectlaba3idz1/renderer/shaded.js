// renderer/shaded.js
class ShadedRenderer extends SolidRenderer {
constructor(canvas) {
super(canvas);
this.lighting = new Lighting();
}

render(cube) {
    // Очистка
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.zbuffer.clear();

    const triangles = cube.triangulate();

    triangles.forEach(tri => {
        const v1 = cube.vertices[tri.vertices[0]];
        const v2 = cube.vertices[tri.vertices[1]];
        const v3 = cube.vertices[tri.vertices[2]];

        // 🔥 берём нормаль прямо из triangle (мы её туда уже прокинули)
        const normal = tri.normal;

        // Освещение
        const intensity = this.lighting.calculateIntensity(normal);
        const shadedColor = this.lighting.applyLighting(tri.color, intensity);

        this.drawTriangle(v1, v2, v3, shadedColor);
    });
}

}
