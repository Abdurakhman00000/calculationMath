// Инициализация графика
let chart = null;

document.getElementById('calculator').addEventListener('submit', function (e) {
    e.preventDefault();

    // Получаем значения из формы
    const m = parseFloat(document.getElementById('module').value);
    const z = parseInt(document.getElementById('teeth').value, 10);
    const alpha = parseFloat(document.getElementById('angle').value);
    const x = parseFloat(document.getElementById('shift').value);

    // Преобразуем угол из градусов в радианы
    const alphaRad = (Math.PI / 180) * alpha;

    // Рассчитываем параметры
    const d = m * z; // Делительный диаметр
    const da = d + 2 * m * (1 + x); // Диаметр окружности вершин
    const df = d - 2.5 * m; // Диаметр окружности впадин

    // Выводим результаты
    document.getElementById('diameter').textContent = d.toFixed(2);
    document.getElementById('addendumDiameter').textContent = da.toFixed(2);
    document.getElementById('dedendumDiameter').textContent = df.toFixed(2);

    // Обновляем график
    updateChart(d, da, df);

    // Обновляем визуализацию зубчатого колеса
    drawGear(d, da, df, z, m);
});

function updateChart(d, da, df) {
    const ctx = document.getElementById('chart').getContext('2d');

    // Если график уже создан, уничтожаем его
    if (chart) {
        chart.destroy();
    }

    // Создаем новый график
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Делительный диаметр (d)', 'Диаметр окружности вершин (da)', 'Диаметр окружности впадин (df)'],
            datasets: [{
                label: 'Параметры зубо-фрезерного станка',
                data: [d, da, df],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function drawGear(d, da, df, z, m) {
    const canvas = document.getElementById('gearCanvas');
    const ctx = canvas.getContext('2d');

    // Очищаем холст перед рисованием новой детали
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Определяем центр холста
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Радиусы окружностей
    const radiusD = d / 2;
    const radiusDa = da / 2;
    const radiusDf = df / 2;

    // Рисуем окружности
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusD, 0, 2 * Math.PI);
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusDa, 0, 2 * Math.PI);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusDf, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем зубья
    const toothAngle = 2 * Math.PI / z; // Угол между зубьями

    for (let i = 0; i < z; i++) {
        const angle = i * toothAngle;

        // Зубья на окружности
        const x1 = centerX + radiusDa * Math.cos(angle);
        const y1 = centerY + radiusDa * Math.sin(angle);
        const x2 = centerX + radiusDf * Math.cos(angle);
        const y2 = centerY + radiusDf * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
