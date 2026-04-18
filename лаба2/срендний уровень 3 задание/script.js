const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

/* =========================
   ОКНО ОТСЕЧЕНИЯ
========================= */

let win = {
    x: 250,
    y: 180,
    w: 300,
    h: 200
};

/* =========================
   КОДЫ РЕГИОНОВ (9 зон)
========================= */

const INSIDE=0;
const LEFT=1;
const RIGHT=2;
const BOTTOM=4;
const TOP=8;

function outcode(x,y){
    let c = INSIDE;

    if(x < win.x) c |= LEFT;
    else if(x > win.x+win.w) c |= RIGHT;

    if(y < win.y) c |= TOP;
    else if(y > win.y+win.h) c |= BOTTOM;

    return c;
}

/* =========================
   COHEN–SUTHERLAND
========================= */

function clipLine(x1,y1,x2,y2){

    let c1 = outcode(x1,y1);
    let c2 = outcode(x2,y2);

    while(true){

        // полностью внутри
        if(!(c1 | c2)){
            return [x1,y1,x2,y2];
        }

        // полностью вне
        if(c1 & c2){
            return null;
        }

        let cOut = c1 ? c1 : c2;
        let x,y;

        if(cOut & TOP){
            x = x1 + (x2-x1)*(win.y-y1)/(y2-y1);
            y = win.y;
        }
        else if(cOut & BOTTOM){
            x = x1 + (x2-x1)*(win.y+win.h-y1)/(y2-y1);
            y = win.y+win.h;
        }
        else if(cOut & RIGHT){
            y = y1 + (y2-y1)*(win.x+win.w-x1)/(x2-x1);
            x = win.x+win.w;
        }
        else {
            y = y1 + (y2-y1)*(win.x-x1)/(x2-x1);
            x = win.x;
        }

        if(cOut === c1){
            x1=x; y1=y; c1=outcode(x1,y1);
        } else {
            x2=x; y2=y; c2=outcode(x2,y2);
        }
    }
}

/* =========================
   ДАННЫЕ ЛИНИЙ
========================= */

let lines = [];

function generateLines(){
    lines = [];
    for(let i=0;i<20;i++){
        lines.push([
            Math.random()*800,
            Math.random()*600,
            Math.random()*800,
            Math.random()*600
        ]);
    }
    draw();
}

/* =========================
   РИСОВАНИЕ
========================= */

function draw(){

    ctx.clearRect(0,0,800,600);

    // окно
    ctx.strokeStyle="black";
    ctx.lineWidth=2;
    ctx.strokeRect(win.x,win.y,win.w,win.h);

    for(const L of lines){

        // исходная линия (серая)
        ctx.strokeStyle="#bbb";
        ctx.beginPath();
        ctx.moveTo(L[0],L[1]);
        ctx.lineTo(L[2],L[3]);
        ctx.stroke();

        // отсечённая (красная)
        const r = clipLine(...L);

        if(r){
            ctx.strokeStyle="red";
            ctx.lineWidth=3;
            ctx.beginPath();
            ctx.moveTo(r[0],r[1]);
            ctx.lineTo(r[2],r[3]);
            ctx.stroke();
        }
    }
}

/* =========================
   ИНТЕРАКТИВНОЕ ОКНО
========================= */

let dragging=false;
let dx,dy;

canvas.onmousedown = e=>{
    if(
        e.offsetX>win.x && e.offsetX<win.x+win.w &&
        e.offsetY>win.y && e.offsetY<win.y+win.h
    ){
        dragging=true;
        dx=e.offsetX-win.x;
        dy=e.offsetY-win.y;
    }
};

canvas.onmouseup = ()=> dragging=false;

canvas.onmousemove = e=>{
    if(dragging){
        win.x = e.offsetX-dx;
        win.y = e.offsetY-dy;
        draw();
    }
};

/* ========================= */

generateLines();
