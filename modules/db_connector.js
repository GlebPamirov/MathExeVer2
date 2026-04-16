// modules/db_connector.js
const DBConnector = {
    scriptUrl: "https://script.google.com/macros/s/AKfycbwcFlp_NhFWvFqwtTIV0Ha5zpCT5j-S9dr2rWX-y3CXZv4S-Y01CFcPwB5DeGhNMElN/exec",

    sendReport: function(data) {
        const report = {
            date: new Date().toLocaleString(),
            name: data.userName,
            grade: data.grade,
            subject: data.subject,
            topic: data.topicName,
            correct: data.correctCount,
            wrong: data.wrongCount,
            hints: data.hintsUsed,
            score: data.score.toFixed(1),
            mark: data.mark
        };

        console.log("Отправка отчета:", report);

        return fetch(this.scriptUrl, {
            method: "POST",
            mode: "no-cors",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(report)
        })
        .then(() => true)
        .catch(err => {
            console.error("Ошибка сети:", err);
            return false;
        });
    }
};
