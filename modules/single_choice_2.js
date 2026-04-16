// modules/single_choice.js
const SingleChoiceModule = {
    render: function(question, currentStep, totalSteps) {
        // Заменяем $ на нативный JS
        document.getElementById('equation-text').textContent = question.text;
        const hintContent = document.getElementById('hint-content');
        hintContent.textContent = question.hint;
        hintContent.classList.add('hidden');
        document.getElementById('hint-trigger').style.display = 'block';
        
        const grid = document.getElementById('options-grid');
        grid.innerHTML = '';
        const shuffled = [...question.options].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-opt';
            btn.textContent = opt;
            btn.onclick = () => this.handleAnswer(opt, question);
            grid.appendChild(btn);
        });

        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetClear();
            MathJax.typesetPromise();
        }
    },

    handleAnswer: function(selected, question) {
        document.querySelectorAll('.btn-opt').forEach(btn => btn.disabled = true);
        const feedback = document.getElementById('feedback-container');
        const fText = document.getElementById('feedback-text');
        
        feedback.classList.remove('hidden');

        const isCorrect = selected === question.correct;
        window.App.onAnswerSubmitted(isCorrect);

        if (isCorrect) {
            feedback.style.backgroundColor = '#e3fcef';
            feedback.style.color = '#006b3d';
            document.getElementById('feedback-title').textContent = "✨ Верно!";
            fText.textContent = "Задание выполнено правильно.";
        } else {
            feedback.style.backgroundColor = '#ffebe6';
            feedback.style.color = '#bf2600';
            document.getElementById('feedback-title').textContent = "🧐 Разбор:";
            fText.textContent = `Правильный ответ: ${question.correct}\n\nРешение: ${question.solution}`;
        }
        
        document.getElementById('next-q-btn').style.display = 'block';
        if (window.MathJax) MathJax.typesetPromise([fText]);
    }
};
