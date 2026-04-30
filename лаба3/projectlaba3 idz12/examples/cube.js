// models/cube.js
class Cube {
constructor() {
// Вершины куба (8 вершин)
this.vertices = [
new Vector3(-1, -1, -1), // 0
new Vector3(1, -1, -1),  // 1
new Vector3(1, 1, -1),   // 2
new Vector3(-1, 1, -1),  // 3
new Vector3(-1, -1, 1),  // 4
new Vector3(1, -1, 1),   // 5
new Vector3(1, 1, 1),    // 6
new Vector3(-1, 1, 1)    // 7
];

    // Рёбра куба
    this.edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    // Грани куба
    this.faces = [
        { vertices: [0, 1, 2, 3], color: '#ff0000' }, // задняя
        { vertices: [4, 5, 6, 7], color: '#00ff00' }, // передняя
        { vertices: [0, 4, 7, 3], color: '#0000ff' }, // левая
        { vertices: [1, 5, 6, 2], color: '#ffff00' }, // правая
        { vertices: [0, 1, 5, 4], color: '#ff00ff' }, // нижняя
        { vertices: [3, 2, 6, 7], color: '#00ffff' }  // верхняя
    ];

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

// Применение матрицы трансформации
transform(matrix) {
    return this.vertices.map(v => matrix.multiplyVector(v));
}

// Разбиваем грани на треугольники
triangulate() {
    const triangles = [];

    this.faces.forEach(face => {
        const [a, b, c, d] = face.vertices;

        triangles.push({
            vertices: [a, b, c],
            color: face.color,
            normal: face.normal
        });

        triangles.push({
            vertices: [a, c, d],
            color: face.color,
            normal: face.normal
        });
    });

    return triangles;
}

}
