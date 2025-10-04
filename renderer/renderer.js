const historyContainer = document.getElementById('history-container');

function renderHistory(items) {
    let table = ""
    for (let i=0; i < items.length; i++) {
        table += "<li>";
        table += items[i];
        table += "</li>"
    }
    historyContainer.innerHTML = table;
}

window.addEventListener('DOMContentLoaded', async () => {
    const initial = await window.api.getHistory();
    renderHistory(initial);
    window.api.onHistoryUpdated(renderHistory);
});