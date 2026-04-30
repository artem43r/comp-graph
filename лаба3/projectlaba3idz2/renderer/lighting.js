// renderer/lighting.js
class Lighting {
constructor() {
this.ambient = 0.2;   // фоновое освещение
this.diffuse = 0.8;   // диффузное освещение
this.lightDir = new Vector3(1, 1, 1).normalize();
}

// Интенсивность освещения
calculateIntensity(normal) {
    const dot = Math.max(0, normal.dot(this.lightDir));
    return this.ambient + this.diffuse * dot;
}

// Применяем освещение к цвету
applyLighting(color, intensity) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const newR = Math.floor(r * intensity);
    const newG = Math.floor(g * intensity);
    const newB = Math.floor(b * intensity);

    return `rgb(${newR}, ${newG}, ${newB})`;
}

}
