class Defender {
    constructor() {
        this.name = "";
        this.credits = 500;
        this.inventory = [];
        this.roundsWon = 0;
        this.turnsWon = 0;
    }

    buyDefense(defenseType) {
        if(defenseCatalog.findIndex(item => item.name == defenseType) == -1) {
            console.log(`\"${defenseType}\" does not exist`);
            return;
        }
        const defense = defenseCatalog.find(item => item.name == defenseType);
        if (defense && this.credits >= defense.cost) {
            this.credits -= defense.cost;
            this.inventory.push(defense);
            console.log(`You bought ${defenseType}!`);
        } else {
            console.log(`You cannot afford ${defenseType}!`);
        }
    }

    viewInventory() {
        console.log(`${this.name}'s Inventory: ${this.inventory.map(item => item.name).join('\n')}`);
    }

    randomDraw() {
        const drawCost = 200;
        if (this.credits >= drawCost) {
            this.credits -= drawCost;
            const randomDefense = defenseCatalog[Math.floor(Math.random() * defenseCatalog.length)];
            this.inventory.push(randomDefense);
            console.log(`${this.name} drew a random defense: ${randomDefense.name}`);
        } else {
            console.log(`${this.name} cannot afford a random draw`);
        }
    }

    defendAgainst(attackType) {
        const defense = this.inventory.find(item => item.counter == attackType);
        let defenseType = prompt(`Select a defense: \n${this.inventory.map(item => item.name).join('\n')}`);

        while(defenseCatalog.findIndex(item => item.name == defenseType) == -1) {
            console.log(`\"${defenseType}\" does not exist`);
            alert(`\"${defenseType}\" does not exist. Try again`);
            defenseType = prompt(`Select a defense: \n${this.inventory.map(item => item.name).join('\n')}`);
        }

        let successProbability = 1.0; // base success probability of the attack
        this.inventory.splice(this.inventory.findIndex(item => item.name == defenseType), 1);
        console.log(`${this.name} performs ${defenseType}`);

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