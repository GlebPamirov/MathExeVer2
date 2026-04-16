// modules/report_generator.js
const ReportGenerator = {
    render: function(containerId, sessionData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const now = new Date();
        const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const total = sessionData.activeTopic.questions.length;
        const percent = Math.round((sessionData.correctCount / total) * 100);
        const markData = this.getMark(percent);

        let html = `
            <div style="text-align: center; font-family: 'Segoe UI', sans-serif;">
                <h2 style="color: var(--text);">Результаты тестирования</h2>
                
                <div style="text-align: left; background: #f1f2f6; padding: 15px; border-radius: 10px; margin-bottom: 20px; font-size: 0.9rem; line-height: 1.6; border-left: 5px solid ${markData.color};">
                    <b>Ученик:</b> ${sessionData.userName}<br>
                    <b>Класс:</b> ${sessionData.grade} | <b>Предмет:</b> ${sessionData.subject}<br>
                    <b>Тема:</b> ${sessionData.topicName}<br>
                    <b>Дата:</b> ${timeStr}
                </div>

                <div style="font-size: 5rem; font-weight: bold; color: ${markData.color}; line-height: 1;">${markData.mark}</div>
                <div style="font-size: 1.2rem; color: #636e72; margin-bottom: 20px;">${markData.desc}</div>

                <div style="display: flex; justify-content: space-around; margin-bottom: 25px; font-size: 0.9rem; color: #2d3436;">
                    <div>✅ Верно: <b>${sessionData.correctCount}</b></div>
                    <div>❌ Ошибок: <b>${sessionData.wrongCount}</b></div>
                    <div>💡 Подсказок: <b>${sessionData.hintsUsed}</b></div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 0.85rem;">
					<thead>
						<tr style="background: #dfe6e9; text-align: left;">
							<th style="padding: 8px; border: 1px solid #bdc3c7; text-align: center;">№</th>
							<th style="padding: 8px; border: 1px solid #bdc3c7;">Содержание задания</th>
							<th style="padding: 8px; border: 1px solid #bdc3c7; text-align: center;">Результат</th>
							<th style="padding: 8px; border: 1px solid #bdc3c7; text-align: center;">Подсказка</th>
						</tr>
					</thead>
					<tbody>
						${sessionData.activeTopic.questions.map((q, index) => {
							const log = sessionData.answersLog[index] || { isCorrect: false, usedHint: false };
							return `
								<tr style="border-bottom: 1px solid #dfe6e9;">
									<td style="padding: 10px; border: 1px solid #bdc3c7; width: 30px; text-align: center;">
										${index + 1}
									</td>
									<td style="padding: 10px; border: 1px solid #bdc3c7; text-align: left; font-size: 0.8rem; color: #2d3436;">
										${q.text} </td>
									<td style="padding: 10px; border: 1px solid #bdc3c7; text-align: center; font-size: 1.2rem;">
										${log.isCorrect ? '<span style="color: #00b894;">✔</span>' : '<span style="color: #d63031;">✘</span>'}
									</td>
									<td style="padding: 10px; border: 1px solid #bdc3c7; text-align: center; font-size: 1.2rem;">
										${log.usedHint ? '<span style="color: #fdcb6e;">❓</span>' : '—'}
									</td>
								</tr>
							`;
						}).join('')}
					</tbody>
                </table>

                <div style="text-align: left; padding: 15px; border: 1px dashed #b2bec3; border-radius: 10px; background: #fafafa;">
                    <h4 style="margin-top: 0; color: #2d3436;">📊 Педагогический анализ:</h4>
                    <p style="margin: 5px 0;"><b>Усвоено:</b> <span style="color: #636e72;">${percent >= 50 ? 'Базовый уровень' : 'Требует внимания'}</span></p>
                    <p style="margin: 5px 0;"><b>Повторить:</b> <span style="color: #636e72;">${sessionData.wrongCount > 0 ? 'Разбор ошибок в решении' : 'Нет'}</span></p>
                </div>

                <button class="btn" onclick="location.reload()" style="margin-top: 20px;">На главную</button>
            </div>
        `;

        container.innerHTML = html;
        if (window.MathJax) MathJax.typesetPromise([container]);
    },

    getMark: function(percent) {
        if (percent >= 91) return { mark: "5", desc: "Отлично", color: "#00b894" };
        if (percent >= 71) return { mark: "4", desc: "Хорошо", color: "#0984e3" };
        if (percent >= 51) return { mark: "3", desc: "Удовлетворительно", color: "#fdcb6e" };
        return { mark: "2", desc: "Неудовлетворительно", color: "#d63031" };
    }
};
