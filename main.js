window.onload = () => {
    const game = new Game();
    game.initialize();
};

function logToConsole(message) {
    const consoleElement = document.getElementById('console');
    const newMessage = document.createElement('div');
    newMessage.textContent = message;
    consoleElement.appendChild(newMessage);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}