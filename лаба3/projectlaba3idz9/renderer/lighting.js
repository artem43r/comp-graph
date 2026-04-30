// renderer/lighting.js
class Lighting {
constructor() {
// компоненты Фонга
this.ambientK = 0.2;
this.diffuseK = 0.7;
this.specularK = 0.8;
this.shininess = 32;


    // точечный источник света
    this.lightPos = new Vector3(2, 2, 2);

    // позиция камеры
    this.cameraPos = new Vector3(0, 0, 5);
}

// Полная модель Фонга: I = Ia + Id + Is
calculate(normal, fragPos) {
if (!normal || !fragPos) return 1;


const N = new Vector3(normal.x, normal.y, normal.z).normalize();

const L = this.lightPos.subtract(fragPos).normalize();
const V = this.cameraPos.subtract(fragPos).normalize();

const diff = Math.max(0, N.dot(L));

const reflect = N.multiply(2 * N.dot(L)).subtract(L).normalize();

const spec = Math.pow(Math.max(0, reflect.dot(V)), this.shininess);

const result = this.ambientK + this.diffuseK * diff + this.specularK * spec;

if (isNaN(result)) return 1;

return result;


}


// применяем освещение к цвету
apply(color, intensity) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const nr = Math.min(255, Math.floor(r * intensity));
    const ng = Math.min(255, Math.floor(g * intensity));
    const nb = Math.min(255, Math.floor(b * intensity));

    return `rgb(${nr}, ${ng}, ${nb})`;
}


}
