// modules/graph_module.js
const GraphModule = {
    GRID: 25,

    // Основной метод входа
    render: function(containerId, figureType) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Создаем или очищаем canvas
        container.innerHTML = '<canvas id="geometry-canvas" style="max-width:100%; height:auto; display:block; margin: 0 auto 15px; border: 1px solid #dfe6e9; border-radius: 8px;"></canvas>';
        const canvas = document.getElementById('geometry-canvas');
        const ctx = canvas.getContext('2d');

        // Настройка высокого разрешения (DPI)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 400 * dpr;
        canvas.height = 250 * dpr;
        ctx.scale(dpr, dpr);

        this.drawGrid(ctx);
        
        // Выбор функции отрисовки по типу из базы данных
        if (this.drawings[figureType]) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#2d3436';
            ctx.font = "italic 14px 'Times New Roman'";
            this.drawings[figureType](ctx, this.project);
        }
    },

    drawGrid: function(ctx) {
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 300; x += this.GRID) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 250); ctx.stroke();
        }
        for (let y = 0; y <= 250; y += this.GRID) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(300, y); ctx.stroke();
        }
    },

    // Проекция для 3D фигур (стереометрия)
    project: (x, y, z) => [x + z * 0.5, y - z * 0.5],

    // Библиотека фигур
    drawings: {
        "parallel_lines": (ctx) => {
			ctx.lineWidth = 1.5; ctx.strokeStyle = '#2d3436';
			ctx.beginPath(); ctx.moveTo(25, 25); ctx.lineTo(25, 175); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(250, 175); ctx.lineTo(25, 175); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(25, 25); ctx.lineTo(175, 25); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(175, 25); ctx.lineTo(250, 175); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(175, 25); ctx.lineTo(175, 175); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(25, 25); ctx.lineTo(175, 175); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(75, 75); ctx.lineTo(175, 25); ctx.stroke();

        },
        "iso_triangle": (ctx) => {
            const A = [150, 50], B = [50, 200], C = [250, 200];
            ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.closePath(); ctx.stroke();
            ctx.setLineDash([4, 3]); ctx.strokeStyle = '#00b894';
            ctx.beginPath(); ctx.moveTo(150, 50); ctx.lineTo(150, 200); ctx.stroke();
            ctx.setLineDash([]); ctx.fillStyle = "#2d3436";
            ctx.fillText("A", 145, 40); ctx.fillText("B", 35, 210); ctx.fillText("C", 255, 210);
        },
        "tetrahedron": (ctx, p) => {
            const nodes = [p(150,50,0), p(75,200,0), p(225,200,0), p(150,175,100)];
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(...nodes[1]); ctx.lineTo(...nodes[2]); ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(...nodes[0]); ctx.lineTo(...nodes[1]); ctx.lineTo(...nodes[3]); ctx.lineTo(...nodes[0]); ctx.lineTo(...nodes[2]); ctx.lineTo(...nodes[3]); ctx.stroke();
            ctx.fillText("S", nodes[0][0], nodes[0][1]-5);
        },
        // Сюда добавляются остальные фигуры по аналогии
		"trapetia": (ctx, p) => {		
			// Сгенерированный чертеж
			ctx.lineWidth = 2; ctx.strokeStyle = '#2d3436';
			ctx.beginPath(); ctx.moveTo(25, 200); ctx.lineTo(25, 25); ctx.stroke();
			ctx.fillText("аn", 35, 102.5);
			ctx.beginPath(); ctx.moveTo(25, 25); ctx.lineTo(250, 200); ctx.stroke();
			ctx.fillText("55", 147.5, 102.5);
			ctx.beginPath(); ctx.moveTo(250, 200); ctx.lineTo(125, 25); ctx.stroke();
			ctx.fillText("8", 197.5, 102.5);
			ctx.beginPath(); ctx.moveTo(125, 25); ctx.lineTo(25, 200); ctx.stroke();
			ctx.fillText("7", 85, 102.5);
			ctx.beginPath(); ctx.moveTo(25, 25); ctx.lineTo(125, 25); ctx.stroke();
			ctx.fillText("8", 85, 15);
			ctx.beginPath(); ctx.moveTo(125, 25); ctx.lineTo(125, 200); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(25, 200); ctx.lineTo(250, 200); ctx.stroke();
			ctx.beginPath(); ctx.arc(25, 200, 3, 0, 6.28); ctx.fill();
			ctx.fillText("A", 33, 192);
			ctx.beginPath(); ctx.arc(125, 25, 3, 0, 6.28); ctx.fill();
			ctx.fillText("B", 133, 17);
			ctx.beginPath(); ctx.arc(250, 200, 3, 0, 6.28); ctx.fill();
			ctx.fillText("C", 258, 192);
			ctx.beginPath(); ctx.arc(25, 25, 3, 0, 6.28); ctx.fill();
			ctx.fillText("D", 33, 17);
			ctx.beginPath(); ctx.arc(125, 200, 3, 0, 6.28); ctx.fill();
			ctx.fillText("E", 133, 192);
		},		
		
		
		"trapetia_2": (ctx, p) => {		
			// Сгенерированный чертеж		
			ctx.lineWidth = 1.5; ctx.strokeStyle = '#2d3436';
			ctx.beginPath(); ctx.moveTo(25, 50); ctx.lineTo(25, 200); ctx.stroke();
			ctx.fillText("b", 30, 115);
			ctx.beginPath(); ctx.moveTo(25, 50); ctx.lineTo(200, 50); ctx.stroke();
			ctx.fillText("a", 117.5, 40);
			ctx.beginPath(); ctx.moveTo(25, 200); ctx.lineTo(275, 200); ctx.stroke();
			ctx.fillText("y", 155, 190);
			ctx.beginPath(); ctx.moveTo(200, 50); ctx.lineTo(25, 162.5999984741211); ctx.stroke();
			ctx.fillText("z+6", 117.5, 96.29999923706055);
			ctx.beginPath(); ctx.moveTo(200, 50); ctx.lineTo(200, 200); ctx.stroke();
			ctx.fillText("h", 205, 115);
			ctx.beginPath(); ctx.moveTo(200, 200); ctx.lineTo(25, 162.5999984741211); ctx.stroke();
			ctx.fillText("l", 117.5, 171.29999923706055);
			ctx.beginPath(); ctx.moveTo(200, 50); ctx.lineTo(275, 200); ctx.stroke();
			ctx.fillText("x", 242.5, 115);
			ctx.beginPath(); ctx.arc(275, 200, 2.5, 0, 6.28); ctx.fill();
			ctx.fillText("A", 283, 192);
			ctx.beginPath(); ctx.arc(200, 50, 2.5, 0, 6.28); ctx.fill();
			ctx.fillText("B", 208, 42);
			ctx.beginPath(); ctx.arc(25, 50, 2.5, 0, 6.28); ctx.fill();
			ctx.fillText("C", 33, 42);
			ctx.beginPath(); ctx.arc(25, 200, 2.5, 0, 6.28); ctx.fill();
			ctx.fillText("D", 33, 192);
			ctx.beginPath(); ctx.arc(25, 162.5999984741211, 2.5, 0, 6.28); ctx.fill();
			ctx.fillText("E", 33, 154.5999984741211);
			ctx.beginPath(); ctx.arc(200, 200, 2.5, 0, 6.28); ctx.fill();
			ctx.fillText("F", 208, 192);
		}
		
		
		
    }
};
