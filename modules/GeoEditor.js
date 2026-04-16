<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>GeoEditor v4.0 — Интуитивный интерфейс</title>
    <style>
        :root { --accent: #0984e3; --panel: #f1f2f6; --text: #2d3436; }
        body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; background: #dfe6e9; margin: 0; padding: 20px; }
        .toolbar { background: var(--panel); padding: 10px; border-radius: 10px; display: flex; gap: 8px; margin-bottom: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .btn { padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer; border-radius: 5px; font-size: 14px; }
        #canvas-container { position: relative; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
        canvas { display: block; cursor: crosshair; }
        #code-output { margin-top: 15px; width: 800px; height: 60px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #ccc; border-radius: 8px; resize: none; }
        #edit-overlay { display: none; position: absolute; background: white; padding: 5px; border: 2px solid var(--accent); border-radius: 4px; z-index: 100; }
        .controls-hint { margin-top: 10px; font-size: 0.8rem; color: #636e72; text-align: center; line-height: 1.5; }
    </style>
</head>
<body>

<div class="toolbar">
    <div style="font-weight: bold; padding: 8px; color: var(--accent);">GeoEditor v4.0</div>
    <button class="btn" style="background: #00b894; color: white; border: none;" onclick="generateCode()">Экспорт кода</button>
</div>

<div id="canvas-container">
    <canvas id="geoCanvas" width="400" height="250"></canvas>
    <div id="edit-overlay">
        <input type="text" id="edit-input" style="width: 80px; text-align: center; border: 1px solid #ccc;">
    </div>
</div>

<div class="controls-hint">
    <b>Двойной клик:</b> создать точку | <b>Зажать и тянуть:</b> создать линию<br>
    <b>Правый клик:</b> удалить точку | <b>Двойной клик по подсвеченному центру:</b> подписать сегмент
</div>

<textarea id="code-output" readonly placeholder="Готовый код появится здесь..."></textarea>

<script>
    const canvas = document.getElementById('geoCanvas');
    const ctx = canvas.getContext('2d');
    const overlay = document.getElementById('edit-overlay');
    const editInput = document.getElementById('edit-input');
    const output = document.getElementById('code-output');

    const GRID = 25;
    const SNAP_DIST = 10;
    const POINT_RADIUS = 2.5;

    let elements = { points: [], lines: [], segments: [] };
    let isDrawingLine = false;
    let dragStartPoint = null;
    let mousePos = { x: 0, y: 0 };
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    canvas.oncontextmenu = (e) => e.preventDefault();

    canvas.addEventListener('mousedown', (e) => {
        const {x, y} = getMousePos(e);
        
        // Правый клик — удаление
        if (e.button === 2) {
            elements.points = elements.points.filter(p => Math.hypot(p.x - x, p.y - y) > 10);
            return;
        }

        // Левый клик — начало линии
        const hitPoint = elements.points.find(p => Math.hypot(p.x - x, p.y - y) < 10);
        if (hitPoint) {
            isDrawingLine = true;
            dragStartPoint = hitPoint;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const pos = getMousePos(e);
        mousePos.x = pos.x;
        mousePos.y = pos.y;
    });

    window.addEventListener('mouseup', (e) => {
        if (isDrawingLine && dragStartPoint) {
            const hitPoint = elements.points.find(p => Math.hypot(p.x - mousePos.x, p.y - mousePos.y) < 10 && p !== dragStartPoint);
            if (hitPoint) {
                elements.lines.push({ p1: dragStartPoint, p2: hitPoint });
            }
        }
        isDrawingLine = false;
        dragStartPoint = null;
    });

    canvas.addEventListener('dblclick', (e) => {
        const {x, y} = getMousePos(e);
        
        // Сначала проверяем, не кликнули ли по существующей подписи
        const hitSeg = findSegmentAt(x, y);
        if (hitSeg) return showEditor(hitSeg, x, y);

        // Иначе создаем новую точку
        const snap = calculateSnap(x, y);
        const pName = alphabet[elements.points.length % alphabet.length];
        elements.points.push({ x: snap.x, y: snap.y, name: pName, blink: 1.0 });
    });

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function calculateSnap(x, y) {
        const gx = Math.round(x / GRID) * GRID;
        const gy = Math.round(y / GRID) * GRID;
        if (Math.hypot(x - gx, y - gy) < SNAP_DIST) return { x: gx, y: gy };

        for (let l of elements.lines) {
            const p = getClosestPointOnSegment(x, y, l.p1.x, l.p1.y, l.p2.x, l.p2.y);
            if (Math.hypot(x - p.x, y - p.y) < 8) return { x: p.x, y: p.y };
        }
        return { x, y };
    }

    function getClosestPointOnSegment(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        if (dx === 0 && dy === 0) return { x: x1, y: y1 };
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
        return { x: x1 + t * dx, y: y1 + t * dy };
    }

    function findSegmentAt(x, y) {
        // Ищем в центрах сегментов, которые мы вычисляем при отрисовке
        return elements.segments.find(s => Math.hypot(s.midX - x, s.midY - y) < 15);
    }

    function showEditor(seg, x, y) {
        overlay.style.display = 'block';
        overlay.style.left = (x + 10) + 'px'; overlay.style.top = (y - 10) + 'px';
        editInput.value = seg.label || '';
        editInput.focus();
        editInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                seg.label = editInput.value;
                overlay.style.display = 'none';
            }
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();

        // Сбрасываем массив сегментов для пересчета координат клика
        const currentSegments = [];

        elements.lines.forEach(line => {
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(line.p1.x, line.p1.y); ctx.lineTo(line.p2.x, line.p2.y); ctx.stroke();

            // Логика сегментации: ищем точки, лежащие на этой линии
            let ptsOnLine = elements.points.filter(p => {
                const d = getClosestPointOnSegment(p.x, p.y, line.p1.x, line.p1.y, line.p2.x, line.p2.y);
                return Math.hypot(p.x - d.x, p.y - d.y) < 1;
            });

            // Сортируем точки вдоль линии от p1 к p2
            ptsOnLine.sort((a, b) => Math.hypot(a.x - line.p1.x, a.y - line.p1.y) - Math.hypot(b.x - line.p1.x, b.y - line.p1.y));

            // Создаем визуальные зоны для подписей между всеми точками на линии
            for (let i = 0; i < ptsOnLine.length - 1; i++) {
                const s1 = ptsOnLine[i], s2 = ptsOnLine[i+1];
                const mx = (s1.x + s2.x) / 2, my = (s1.y + s2.y) / 2;
                const id = `seg_${s1.name}_${s2.name}`;
                
                // Находим или создаем объект данных для подписи
                let segData = elements.segments.find(s => s.id === id);
                if (!segData) { segData = { id: id, label: '' }; elements.segments.push(segData); }
                segData.midX = mx; segData.midY = my; // Обновляем координаты для клика
                currentSegments.push(segData);

                // Рисуем подсветку
                ctx.fillStyle = 'rgba(9, 132, 227, 0.1)';
                ctx.beginPath(); ctx.arc(mx, my, 8, 0, 7); ctx.fill();

                if (segData.label) {
                    const ang = Math.atan2(s2.y - s1.y, s2.x - s1.x);
                    ctx.fillStyle = '#0984e3'; ctx.font = 'bold 11px Arial';
                    ctx.fillText(segData.label, mx + Math.cos(ang+1.57)*12, my + Math.sin(ang+1.57)*12 + 4);
                }
            }
        });

        if (isDrawingLine) {
            ctx.strokeStyle = '#0984e3'; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(dragStartPoint.x, dragStartPoint.y); ctx.lineTo(mousePos.x, mousePos.y); ctx.stroke();
        }

        elements.points.forEach(p => {
            if (p.blink > 0) {
                ctx.fillStyle = `rgba(9, 132, 227, ${p.blink * 0.2})`;
                ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, 7); ctx.fill();
                p.blink -= 0.04;
            }
            ctx.fillStyle = '#2d3436';
            ctx.beginPath(); ctx.arc(p.x, p.y, POINT_RADIUS, 0, 7); ctx.fill();
            ctx.font = 'italic 13px "Times New Roman"';
            ctx.fillText(p.name, p.x + 8, p.y - 8);
        });

        requestAnimationFrame(draw);
    }

    function drawGrid() {
        ctx.strokeStyle = '#f5f5f5'; ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        for (let y = 0; y <= canvas.height; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    }

    function generateCode() {
        let code = `ctx.lineWidth = 1.5; ctx.strokeStyle = '#2d3436';\n`;
        elements.lines.forEach(l => {
            code += `ctx.beginPath(); ctx.moveTo(${l.p1.x}, ${l.p1.y}); ctx.lineTo(${l.p2.x}, ${l.p2.y}); ctx.stroke();\n`;
        });
        elements.segments.forEach(s => {
            if(s.label) code += `ctx.fillText("${s.label}", ${s.midX.toFixed(1)}, ${s.midY.toFixed(1)});\n`;
        });
        output.value = code;
    }

    draw();
</script>
</body>
</html>
