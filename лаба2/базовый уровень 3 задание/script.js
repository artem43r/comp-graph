const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const timeDiv = document.getElementById("time");

function setPixel(x,y,r,g,b){
    ctx.fillStyle=`rgb(${r|0},${g|0},${b|0})`;
    ctx.fillRect(x,y,1,1);
}

function edge(a,b,c){
    return (c.x-a.x)*(b.y-a.y)-(c.y-a.y)*(b.x-a.x);
}

function randColor(){
    return [Math.random()*255,Math.random()*255,Math.random()*255];
}

function randV(){
    return {x:Math.random()*800,y:Math.random()*600,c:randColor()};
}

/* ========= METHOD 1 ========= */

function rasterBB(A,B,C){

    const area=edge(A,B,C);
    if(area<=0) return;

    const minX=Math.floor(Math.min(A.x,B.x,C.x));
    const maxX=Math.ceil(Math.max(A.x,B.x,C.x));
    const minY=Math.floor(Math.min(A.y,B.y,C.y));
    const maxY=Math.ceil(Math.max(A.y,B.y,C.y));

    for(let y=minY;y<=maxY;y++){
        for(let x=minX;x<=maxX;x++){

            const P={x,y};
            const w1=edge(B,C,P)/area;
            const w2=edge(C,A,P)/area;
            const w3=edge(A,B,P)/area;

            if(w1>=0 && w2>=0 && w3>=0){
                const r=w1*A.c[0]+w2*B.c[0]+w3*C.c[0];
                const g=w1*A.c[1]+w2*B.c[1]+w3*C.c[1];
                const b=w1*A.c[2]+w2*B.c[2]+w3*C.c[2];
                setPixel(x,y,r,g,b);
            }
        }
    }
}

/* ========= METHOD 2 ========= */

function rasterScan(A,B,C){

    if(edge(A,B,C)<=0) return; // back-face culling

    // сортировка по Y
    const v=[A,B,C].sort((a,b)=>a.y-b.y);
    const top=v[0], mid=v[1], bot=v[2];

    function lerp(a,b,t){ return a+(b-a)*t }

    function lerpColor(c1,c2,t){
        return [
            lerp(c1[0],c2[0],t),
            lerp(c1[1],c2[1],t),
            lerp(c1[2],c2[2],t)
        ];
    }

    for(let y=Math.floor(top.y); y<=Math.floor(bot.y); y++){

        let xa, xb, ca, cb;

        if(y < mid.y){

            let t1=(y-top.y)/(bot.y-top.y||1);
            let t2=(y-top.y)/(mid.y-top.y||1);

            xa = lerp(top.x, bot.x, t1);
            xb = lerp(top.x, mid.x, t2);

            ca = lerpColor(top.c, bot.c, t1);
            cb = lerpColor(top.c, mid.c, t2);

        } else {

            let t1=(y-top.y)/(bot.y-top.y||1);
            let t2=(y-mid.y)/(bot.y-mid.y||1);

            xa = lerp(top.x, bot.x, t1);
            xb = lerp(mid.x, bot.x, t2);

            ca = lerpColor(top.c, bot.c, t1);
            cb = lerpColor(mid.c, bot.c, t2);
        }

        if(xa>xb){
            [xa,xb]=[xb,xa];
            [ca,cb]=[cb,ca];
        }

        for(let x=Math.floor(xa); x<=Math.floor(xb); x++){

            let t=(x-xa)/(xb-xa||1);
            let col = lerpColor(ca, cb, t);

            setPixel(x,y,col[0],col[1],col[2]);
        }
    }
}


/* ========= SCENES ========= */

function drawSceneBoundingBox(){
    ctx.clearRect(0,0,800,600);
    const t0=performance.now();

    for(let i=0;i<100;i++){
        rasterBB(randV(),randV(),randV());
    }

    const t1=performance.now();
    timeDiv.innerText="BB+Bary time: "+(t1-t0).toFixed(1)+" ms";
}

function drawSceneScanline(){
    ctx.clearRect(0,0,800,600);
    const t0=performance.now();

    for(let i=0;i<100;i++){
        rasterScan(randV(),randV(),randV());
    }

    const t1=performance.now();
    timeDiv.innerText="Scanline time: "+(t1-t0).toFixed(1)+" ms";
}

