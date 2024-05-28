class Game {
    constructor() {
        this.attacker = new Attacker();
        this.defender = new Defender();
        this.round = 1;
        this.currentTurn = 1;
        this.winningRound = 10;
        this.overtime = false;
    }

    initialize() {
        this.setInputHandler(this.handleNameInput.bind(this, 'Player 1 Name:', (name) => {
            this.attacker.name = name;
            logToConsole(this.attacker.name);
            logToConsole('Player 2 Name:');
            this.setInputHandler(this.handleNameInput.bind(this, 'Player 2 Name:', (name) => {
                this.defender.name = name;
                logToConsole(this.defender.name);
                this.startRound();
            }));
        }));
        logToConsole('Player 1 Name:');
    }

    handleNameInput(promptMessage, callback, input) {
        if (input === null || input.trim() === '') {
            logToConsole('Name cannot be null. Try Again.');
            logToConsole(promptMessage);
            return;
        }
        callback(input.trim());
    }

    setInputHandler(handler) {
        this.inputHandler = handler;
    }

    handleInput(input) {
        if (this.inputHandler) {
            this.inputHandler(input);
        }
    }

    startRound() {
        logToConsole(`Round ${this.round} started`);
        this.currentTurn = 1;
        this.promptBuyPhase();
    }

    modifyPrices(multiplier) {
        attackCatalog.forEach(item => item.cost *= multiplier);
        defenseCatalog.forEach(item => item.cost *= multiplier);
    }

    restorePrices(multiplier) {
        attackCatalog.forEach(item => item.cost /= multiplier);
        defenseCatalog.forEach(item => item.cost /= multiplier);
    }

    promptBuyPhase() {
        const isSpecialTurn = Math.random() < 0.1; // 10% chance for a special turn
        const specialMultiplier = Math.random() < 0.5 ? 2 : 0.5;

        logToConsole(`Turn ${this.currentTurn} started`);
        if (isSpecialTurn) {
            logToConsole("Special Turn! Prices are modified.");
            this.modifyPrices(specialMultiplier);
        }

        this.setInputHandler(this.handleBuyPhaseInput.bind(this, this.attacker, attackCatalog, 'attack', () => {
            logToConsole(`Buy Phase: \n${this.defender.name} has ${this.defender.credits} credits. Choose a defense to buy, type 'draw' for a random draw (200 credits), type 'view' to view inventory, or type 'done' to stop purchasing: \n${defenseCatalog.map(item => `${item.name} (${item.cost} credits)`).join('\n')}`);
            this.setInputHandler(this.handleBuyPhaseInput.bind(this, this.defender, defenseCatalog, 'defense', () => {
                if (isSpecialTurn) {
                    this.restorePrices(specialMultiplier);
                }
                this.turn();
            }));
        }));
        logToConsole(`Buy Phase: \n${this.attacker.name} has ${this.attacker.credits} credits. Choose a attack to buy, type 'draw' for a random draw (200 credits), type 'view' to view inventory, or type 'done' to stop purchasing: \n${attackCatalog.map(item => `${item.name} (${item.cost} credits)`).join('\n')}`);
    }

    handleBuyPhaseInput(player, catalog, type, callback, input) {
        let stopPurchasing = false;

        if (input.toLowerCase() === 'draw') {
            player.randomDraw();
        } else if (input.toLowerCase() === 'view') {
            player.viewInventory();
        } else if (input.toLowerCase() === 'done') {
            stopPurchasing = true;
        } else {
            if (type === 'attack') {
                player.buyAttack(input);
            } else {
                player.buyDefense(input);
            }
        }

        if (stopPurchasing) {
            callback();
        }
    }

    turn() {
        this.setInputHandler(this.handleTurnInput.bind(this));
        logToConsole(`Select an attack (type 'default' for default attack): \n${this.attacker.inventory.map(item => item.name).join('\n')}`);
    }

    handleTurnInput(input) {
        let attackType = input.trim();
        if (this.attacker.inventory.findIndex(item => item.name == attackType) == -1) {
            if (attackType.toLowerCase() == 'default') {
                attackType = 'Default Attack';
            } else {
                logToConsole(`\"${attackType}\" does not exist.`);
                logToConsole(`Select an attack (type 'default' for default attack): \n${this.attacker.inventory.map(item => item.name).join('\n')}`);
                return;
            }
        }
        this.attacker.performAttack(this.defender, attackType);
        this.setInputHandler(this.handleDefenseInput.bind(this)); // Set input handler for defense
        logToConsole(`Select a defense (type 'default' for default defense): \n${this.defender.inventory.map(item => item.name).join('\n')}`);
    }

    handleDefenseInput(input) {
        const attackType = this.attacker.currentAttack;
        const success = this.defender.defendAgainst(attackType, input);
        if (success) {
            logToConsole(`${this.defender.name} defended successfully!`);
            this.defender.turnsWon++;
        } else {
            logToConsole(`${this.defender.name} failed to defend!`);
            this.attacker.turnsWon++;
        }
        this.currentTurn++;
        if (this.currentTurn == 4) {
            this.endRound();
        } else {
            this.promptBuyPhase();
        }
    }

    endRound() {
        logToConsole(`Round ${this.round} ended`);

        if ((this.attacker.roundsWon == this.defender.roundsWon) && this.round == 18) { // overtime if the game is 9-9 tied
            this.overtime = true;
        }

        if ((this.round == this.winningRound-1) || this.overtime) { // Switch sides after the 9th round or the next round of overtime
            this.switchSides();
        }

        if ((!this.overtime && this.attacker.roundsWon == 10) || (this.overtime && (this.attacker.roundsWon + 2 > this.defender.roundsWon))) { // Checks winning conditions
            logToConsole(`${this.attacker.name} has won the game!`);
        } else if ((!this.overtime && this.defender.roundsWon == 10) || (this.overtime && (this.defender.roundsWon + 2 > this.attacker.roundsWon))) {
            logToConsole(`${this.defender.name} has won the game!`)
        } else {
            if (this.attacker.turnsWon > this.defender.turnsWon) {
                logToConsole(`Attacker ${this.attacker.name} has won this round!`);
                logToConsole(`Attacker ${this.attacker.name} has acquired 1000 credits!`)
                logToConsole(`Defender ${this.defender.name} has acquired 750 credits!`);
                this.attacker.credits += 1000;
                this.defender.credits += 750;
            } else {
                logToConsole(`Defender ${this.defender.name} has won this round!`);
                logToConsole(`Defender ${this.defender.name} has acquired 1000 credits!`);
                logToConsole(`Attacker ${this.attacker.name} has acquired 750 credits!`)
                this.defender.credits += 1000;
                this.attacker.credits += 750;
            }
            this.attacker.turnsWon = 0;
            this.defender.turnsWon = 0;
            this.round++;
            this.startRound();
        }
    }

    switchSides() {
        logToConsole("Switching Sides");
        const attackWon = this.attacker.roundsWon; // create temp variables to keep scores and names before switching
        const defendWon = this.defender.roundsWon;
        const attackName = this.attacker.name;
        const defendName = this.defender.name;

        const newAttacker = new Defender(); // Switch the roles
        const newDefender = new Attacker();

        this.attacker = newAttacker;
        this.defender = newDefender;

        this.attacker.roundsWon = defendWon; // Keep scores
        this.defender.roundsWon = attackWon;
        this.attacker.name = defendName; // Switch names
        this.defender.name = attackName;
        
        if(this.overtime) {
            this.attacker.credits = 1000;
            this.defender.credits = 1000;
        }
    }
}

let messageCount = 0;

function logToConsole(message) {
    const consoleElement = document.getElementById('console');
    messageCount++;

    const newMessage = document.createElement('div');
    newMessage.classList.add('console-message');

    const messageNumber = document.createElement('div');
    messageNumber.classList.add('message-number');
    messageNumber.textContent = messageCount;

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    newMessage.appendChild(messageNumber);
    newMessage.appendChild(messageText);

    consoleElement.appendChild(newMessage);

    typeWriterEffect(messageText, message);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}   

function typeWriterEffect(element, text) {
    const length = text.length;
    let index = 0;
    let baseSpeed = 50; // base speed in milliseconds

    if (length > 100) {
        baseSpeed = 10;
    } else if (length > 50) {
        baseSpeed = 30;
    }

    function typeCharacter() {
        if (index < length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, baseSpeed);
        }
    }

    typeCharacter();
}

window.onload = () => {
    const game = new Game();
    const inputElement = document.getElementById('input');
    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const input = inputElement.value;
            inputElement.value = '';
            game.handleInput(input);
        }
    });
    const inputButton = document.getElementById('send-btn');
    inputButton.addEventListener('click', (event) => {
        const input = inputElement.value;
        inputElement.value = '';
        game.handleInput(input);
    });
    game.initialize();
};
