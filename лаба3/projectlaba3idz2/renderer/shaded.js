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

        // нормаль
        const normal = tri.normal;

        // освещение
        const intensity = this.lighting.calculateIntensity(normal);
        const shadedColor = this.lighting.applyLighting(tri.color, intensity);

        this.drawTriangle(v1, v2, v3, shadedColor);
    });


    this.drawAxes();
}


drawAxes() {
    const origin = this.project(new Vector3(0, 0, 0));
    const xAxis = this.project(new Vector3(2, 0, 0));
    const yAxis = this.project(new Vector3(0, 2, 0));
    const zAxis = this.project(new Vector3(0, 0, 2));

    // X — красная
    this.ctx.strokeStyle = 'red';
    this.drawLine(origin, xAxis);

    // Y — зелёная
    this.ctx.strokeStyle = 'green';
    this.drawLine(origin, yAxis);

    // Z — синяя
    this.ctx.strokeStyle = 'blue';
    this.drawLine(origin, zAxis);
}

}
