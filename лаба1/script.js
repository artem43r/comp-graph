const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let timerSeconds = 0;
let timerInterval = null;
let isCountdown = false;
let laps = [];

// ===== РИСОВАНИЕ КРУГА ПРОГРЕССА =====
function drawTimer() {
    ctx.clearRect(0, 0, 800, 600);

    // фон круга
    ctx.beginPath();
    ctx.arc(400, 300, 150, 0, Math.PI * 2);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 20;
    ctx.stroke();

    // расчет прогресса
    let max = parseInt(document.getElementById('timerInput').value || 60);
    let progress = isCountdown
        ? timerSeconds / max
        : (timerSeconds % 60) / 60;

    // дуга прогресса
    ctx.beginPath();
    ctx.arc(
        400, 300, 150,
        -Math.PI/2,
        -Math.PI/2 + Math.PI * 2 * progress
    );
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 20;
    ctx.stroke();

    // текст времени
    let mins = Math.floor(timerSeconds / 60);
    let secs = timerSeconds % 60;

    ctx.font = '48px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(
        `${mins}:${secs.toString().padStart(2,'0')}`,
        400,
        310
    );

    // вывод лапов
    let html = '<strong>Лапы:</strong><br>';
    laps.forEach((lap,i)=>{
        let m = Math.floor(lap/60);
        let s = lap%60;
        html += `${i+1}: ${m}:${s.toString().padStart(2,'0')}<br>`;
    });
    document.getElementById('lapsList').innerHTML = html;
}

// ===== СЕКУНДОМЕР =====
function startStopwatch() {
    stopTimer();
    isCountdown = false;

    timerInterval = setInterval(()=>{
        timerSeconds++;
        drawTimer();
    }, 1000);
}

// ===== ОБРАТНЫЙ ТАЙМЕР =====
function startCountdown() {
    stopTimer();
    isCountdown = true;

    timerSeconds = parseInt(timerInput.value);
    drawTimer();

    timerInterval = setInterval(()=>{
        timerSeconds--;
        drawTimer();

        if(timerSeconds <= 0){
            stopTimer();
            timerSeconds = 0;
            drawTimer();
            beep();
        }
    },1000);
}

// ===== СТОП =====
function stopTimer() {
    clearInterval(timerInterval);
}

// ===== СБРОС =====
function resetTimer() {
    stopTimer();
    timerSeconds = 0;
    laps = [];
    drawTimer();
}

// ===== ЛАП =====
function lapTimer() {
    if(timerSeconds > 0){
        laps.push(timerSeconds);
        if(laps.length > 10) laps.shift();
        drawTimer();
    }
}

// ===== ЗВУК =====
function beep(){
    const a = new AudioContext();
    const o = a.createOscillator();
    o.connect(a.destination);
    o.start();
    o.stop(a.currentTime + 0.3);
}

drawTimer();
