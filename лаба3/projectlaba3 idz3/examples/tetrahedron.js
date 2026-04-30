// examples/tetrahedron.js
class Tetrahedron {
constructor() {
// Вершины
this.vertices = [
new Vector3(0, 1, 0),      // 0 верх
new Vector3(-1, -1, -1),   // 1
new Vector3(1, -1, -1),    // 2
new Vector3(0, -1, 1)      // 3
];


    // Грани (треугольники!)
    this.faces = [
        { vertices: [0, 1, 2], color: '#ff0000' },
        { vertices: [0, 2, 3], color: '#00ff00' },
        { vertices: [0, 3, 1], color: '#0000ff' },
        { vertices: [1, 3, 2], color: '#ffff00' }
    ];

    // 🔥 нормали (как в кубе)
    this.faces = this.faces.map(face => {
        const v0 = this.vertices[face.vertices[0]];
        const v1 = this.vertices[face.vertices[1]];
        const v2 = this.vertices[face.vertices[2]];

        const edge1 = v1.subtract(v0);
        const edge2 = v2.subtract(v0);

        const normal = edge1.cross(edge2).normalize();

        return { ...face, normal };
    });
}

triangulate() {
    // уже треугольники → просто вернуть
    return this.faces.map(face => ({
        vertices: face.vertices,
        color: face.color,
        normal: face.normal
    }));
}


}
