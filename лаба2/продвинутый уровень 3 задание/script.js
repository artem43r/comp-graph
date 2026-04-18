const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

const N = 10000;

let parts = [];

let useGravity = true;
let useWind = true;

/* =====================
   ЧАСТИЦЫ
===================== */

function makeParticle(){
    return {
        x: Math.random()*800,
        y: Math.random()*600,
        vx: (Math.random()-0.5)*2,
        vy: (Math.random()-0.5)*2
    };
}

function restart(){
    parts = [];
    for(let i=0;i<N;i++){
        parts.push(makeParticle());
    }
}

restart();

/* =====================
   ПЕРЕКЛЮЧАТЕЛИ СИЛ
===================== */

function toggleGravity(){
    useGravity = !useGravity;
}

function toggleWind(){
    useWind = !useWind;
}

/* =====================
   ВЕКТОРНОЕ ПОЛЕ СИЛ
===================== */

function fieldForce(x,y){

    let fx = 0;
    let fy = 0;

    if(useGravity){
        fy += 0.05;
    }

    if(useWind){
        fx += Math.sin(y*0.01)*0.15;
    }

    return {fx, fy};
}

/* =====================
   ФИЗИКА
===================== */

function step(){

    for(const p of parts){

        const f = fieldForce(p.x,p.y);

        p.vx += f.fx;
        p.vy += f.fy;

        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // тороидальные границы
        if(p.x<0) p.x+=800;
        if(p.x>800) p.x-=800;
        if(p.y<0) p.y+=600;
        if(p.y>600) p.y-=600;
    }
}

/* =====================
   РИСОВАНИЕ
===================== */

function draw(){

    ctx.fillStyle="rgba(0,0,0,0.25)";
    ctx.fillRect(0,0,800,600);

    ctx.fillStyle="#00ffff";

    for(const p of parts){
        ctx.fillRect(p.x,p.y,1,1);
    }
}

/* =====================
   LOOP
===================== */

function loop(){
    step();
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
