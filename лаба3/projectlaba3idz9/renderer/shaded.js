// renderer/shaded.js
class ShadedRenderer extends SolidRenderer {
constructor(canvas) {
super(canvas);
this.lighting = new Lighting();
}


render(cube) {
this.ctx.fillStyle = '#000';
this.ctx.fillRect(0, 0, this.width, this.height);
this.zbuffer.clear();


const triangles = cube.triangulate();

triangles.forEach(tri => {
    const v1 = cube.vertices[tri.vertices[0]];
    const v2 = cube.vertices[tri.vertices[1]];
    const v3 = cube.vertices[tri.vertices[2]];

    const normal = tri.normal || new Vector3(0, 0, 1);

    const center = new Vector3(
        (v1.x + v2.x + v3.x) / 3,
        (v1.y + v2.y + v3.y) / 3,
        (v1.z + v2.z + v3.z) / 3
    );

    const intensity = this.lighting.calculate(normal, center);
    const color = this.lighting.apply(tri.color, intensity);


    this.drawTriangle(v1, v2, v3, color);
});

}

}
