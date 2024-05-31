class Attacker {
    constructor() {
        this.name = "";
        this.credits = 500;
        this.inventory = [];
        this.roundsWon = 0;
        this.turnsWon = 0;
    }

    buyAttack(attackType) {
        const attack = attackCatalog.find(item => item.name === attackType);
        if (!attack) {
            logToConsole(`"${attackType}" does not exist.`);
            return;
        }
        if (this.credits >= attack.cost) {
            this.credits -= attack.cost;
            this.inventory.push(attack);
            logToConsole(`You bought ${attackType}!`);
        } else {
            logToConsole(`You cannot afford ${attackType}!`);
        }
    }

    viewInventory() {
        if (this.inventory.length > 0) {
            logToConsole(`${this.name}'s Inventory:`);
            this.inventory.forEach(item => logToConsole(`${item.name} - ${item.cost} credits`));
        } else {
            logToConsole(`${this.name}'s inventory is empty.`);
        }
    }

    randomDraw() {
        const drawCost = 200;
        if (this.credits >= drawCost) {
            this.credits -= drawCost;
            const randomAttack = attackCatalog[Math.floor(Math.random() * attackCatalog.length)];
            this.inventory.push(randomAttack);
            logToConsole(`${this.name} drew a random attack: ${randomAttack.name}`);
        } else {
            logToConsole(`${this.name} cannot afford a random draw`);
        }
    }

    performAttack(defender, attackType) {
        let attack = this.inventory.find(item => item.name === attackType) || attackCatalog.find(item => item.name === "Default Attack");
        this.inventory.splice(this.inventory.findIndex(item => item.name == attack), 1);
        if (attackType.toLowerCase() === "default") {
            attack = attackCatalog.find(item => item.name === "Default Attack");
        }
        logToConsole(`${this.name} performs ${attack.name}`);
        this.currentAttack = attack.name; // Save the current attack being performed
        // Defense handling will be triggered from the game class
    }
}
