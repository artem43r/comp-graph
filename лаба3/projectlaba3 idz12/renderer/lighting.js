// renderer/lighting.js
class Lighting {
constructor() {
this.ambient = 0.2;
this.diffuse = 0.7;
this.specular = 0.8;
this.shininess = 32;


    this.lightPos = new Vector3(2, 2, 2);
    this.cameraPos = new Vector3(0, 0, 5);
}

calculate(normal, pos) {
    const N = normal.normalize();
    const L = this.lightPos.subtract(pos).normalize();
    const V = this.cameraPos.subtract(pos).normalize();

    const diff = Math.max(0, N.dot(L));

    const reflect = N.multiplyScalar(2 * N.dot(L)).subtract(L).normalize();
    const spec = Math.pow(Math.max(0, reflect.dot(V)), this.shininess);

    return this.ambient + this.diffuse * diff + this.specular * spec;
}

apply(color, i) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return `rgb(${Math.min(255, r * i)}, ${Math.min(255, g * i)}, ${Math.min(255, b * i)})`;
}


}
