class Attacker {
    constructor() {
        this.name = "";
        this.credits = 500;
        this.inventory = [];
        this.roundsWon = 0;
        this.turnsWon = 0;
    }

    buyAttack(attackType) {
        if(attackCatalog.findIndex(item => item.name == attackType) == -1){
            console.log(`\"${attackType}\" does not exist.`);
            return;
        }
        const attack = attackCatalog.find(item => item.name == attackType);
        if (attack && this.credits >= attack.cost) {
            this.credits -= attack.cost;
            this.inventory.push(attack);
            console.log(`You bought ${attackType}!`);
        } else {
            console.log(`You cannot afford ${attackType}!`);
        }
    }

    viewInventory() {
        console.log(`${this.name}'s Inventory: ${this.inventory.map(item => item.name).join('\n')}`);
    }

    randomDraw() {
        const drawCost = 200;
        if (this.credits >= drawCost) {
            this.credits -= drawCost;
            const randomAttack = attackCatalog[Math.floor(Math.random() * attackCatalog.length)];
            this.inventory.push(randomAttack);
            console.log(`${this.name} drew a random attack: ${randomAttack.name}`);
        } else {
            console.log(`${this.name} cannot afford a random draw`);
        }
    }

    performAttack(defender, attackType) {
        if (this.inventory.length > 0) {
            this.inventory.splice(this.inventory.findIndex(item => item.name == attackType), 1);
            console.log(`${this.name} performs ${attackType}`);
            if (defender.defendAgainst(attackType)) {
                console.log(`${defender.name} successfully defended against ${attackType}`);
                defender.turnsWon++;
            } else {
                console.log(`${defender.name} failed to defend against ${attackType}`);
                this.turnsWon++;
            }
        } else {
            console.log(`${this.name} has no attacks left to perform`);
        }
    }
}