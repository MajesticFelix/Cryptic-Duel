class Defender {
    constructor() {
        this.name = "";
        this.credits = 500;
        this.inventory = [];
        this.roundsWon = 0;
        this.turnsWon = 0;
    }

    buyDefense(defenseType) {
        const defense = defenseCatalog.find(item => item.name === defenseType);
        if (!defense) {
            logToConsole(`"${defenseType}" does not exist`);
            return;
        }
        if (this.credits >= defense.cost) {
            this.credits -= defense.cost;
            this.inventory.push(defense);
            logToConsole(`You bought ${defenseType}!`);
        } else {
            logToConsole(`You cannot afford ${defenseType}!`);
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
            const randomDefense = defenseCatalog[Math.floor(Math.random() * defenseCatalog.length)];
            this.inventory.push(randomDefense);
            logToConsole(`${this.name} drew a random defense: ${randomDefense.name}`);
        } else {
            logToConsole(`${this.name} cannot afford a random draw`);
        }
    }

    defendAgainst(attackType, defenseType) {
        let defense = this.inventory.find(item => item.counter == attackType);

        while (defenseCatalog.findIndex(item => item.name == defenseType) == -1) {
            if (defenseType.toLowerCase() == "default") {
                break;
            }
            logToConsole(`\"${defenseType}\" does not exist`);
        }

        if (defenseType == "default") {
           defenseType = "Default Defense";
        }

        let successProbability = 1.0; // base success probability of the attack
        this.inventory.splice(this.inventory.findIndex(item => item.name == defenseType), 1);
        logToConsole(`${this.name} performs ${defenseType}`);

        if (defense) {
            this.inventory = this.inventory.filter(item => item != defense);
            switch (defense.effectiveness) {
                case "high":
                    successProbability -= 0.75; // highly effective defense
                    break;
                case "medium":
                    successProbability -= 0.5; // somewhat effective defense
                    break;
                case "low":
                    successProbability -= 0.25; // ineffective defense
                    break;
            }
        } else {
            // If no specific counter is found, check for generic effectiveness
            const genericDefense = this.inventory.find(item => item.effectiveness == "medium" || item.effectiveness == "low");
            if (genericDefense) {
                this.inventory = this.inventory.filter(item => item != genericDefense);
                successProbability -= genericDefense.effectiveness == "medium" ? 0.5 : 0.25;
            }
        }

        // Ensure success probability is not less than 0
        successProbability = Math.max(successProbability, 0);

        // Determine if the attack succeeds
        const attackRoll = Math.random(); // random number between 0 and 1
        return attackRoll >= successProbability; // attack succeeds if roll is greater or equal to successProbability
    }
}
