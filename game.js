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
        let name1 = prompt("Player 1 Name:"); 
        let name2 = prompt("Player 2 Name"); 

        let coinFlip = Math.floor(Math.random()*2); //Decides who goes first of the two players
        if(coinFlip == 0) { 
            this.attacker.name = name1; 
            this.defender.name = name2;
        } else {
            this.attacker.name = name2; 
            this.defender.name = name1;
        }

        this.startRound();
    }

    startRound() {
        console.log(`Round ${this.round} started`);
        this.currentTurn = 1;
        this.promptBuyPhase();
    }

    promptBuyPhase() {
        this.buyPhase(this.attacker, attackCatalog, "attack");
        this.buyPhase(this.defender, defenseCatalog, "defense");
        this.turn();
    }

    buyPhase(player, catalog, type) {
        let stopPurchasing = false;

        console.log("Buy Phase: ");
        console.log(`${player.name} has ${player.credits} credits.`)
        while (!stopPurchasing) {
            const choice = prompt(`${player.name}, choose a ${type} to buy, type 'draw' for a random draw (200 credits), type 'view' to view inventory, or type 'done' to stop purchasing: \n${catalog.map(item => `${item.name} (${item.cost} credits)`).join('\n')}`);
            if (choice.toLowerCase() == "draw") {
                player.randomDraw();
            } else if (choice.toLowerCase() == "view") {
                player.viewInventory();
            } else if (choice.toLowerCase() == "done") {
                stopPurchasing = true;
            } else {
                if (type == "attack") {
                    player.buyAttack(choice);
                } else {
                    player.buyDefense(choice);
                }
            }
        }
    }

    turn() {
        console.log(`Turn ${this.currentTurn} started`);
        let attackType = prompt(`Select an attack: \n${this.attacker.inventory.map(item => item.name).join('\n')}`);
        while(this.attacker.inventory.findIndex(item => item.name == attackType) == -1) {
            console.log(`\"${attackType}\" does not exist.`);
            alert(`\"${attackType}\" does not exist. Try again`);
            attackType = prompt(`Select an attack: \n${this.attacker.inventory.map(item => item.name).join('\n')}`);
        }  
        this.attacker.performAttack(this.defender, attackType);
        this.currentTurn++;
        if(this.currentTurn == 4){ // Triggers end round after turn count passes 4 turns
            this.endRound();
            return;
        } else {
            this.promptBuyPhase();
        }
    }

    endRound() {
        console.log(`Round ${this.round} ended`);

        if ((this.attacker.roundsWon == this.defender.roundsWon) && this.round == 18) { // overtime if the game is 9-9 tied
            this.overtime = true;
        }

        if ((this.round == this.winningRound-1) || this.overtime) { // Switch sides after the 9th round or the next round of overtime
            this.switchSides();
        }

        if ((!this.overtime && this.attacker.roundsWon == 10) || (this.overtime && (this.attacker.roundsWon + 2 > this.defender.roundsWon))) { // Checks winning conditions
            console.log(`${this.attacker.name} has won the game!`);
        } else if ((!this.overtime && this.defender.roundsWon == 10) || (this.overtime && (this.defender.roundsWon + 2 > this.attacker.roundsWon))) {
            console.log(`${this.defender.name} has won the game!`)
        } else {
            if (this.attacker.turnsWon > this.defender.turnsWon) {
                console.log(`Attacker ${this.attacker.name} has won this round!`);
                console.log(`Attacker ${this.attacker.name} has acquired 1000 credits!`)
                console.log(`Defender ${this.defender.name} has acquired 750 credits!`);
                this.attacker.credits += 1000;
                this.defender.credits += 750;
            } else {
                console.log(`Defender ${this.defender.name} has won this round!`);
                console.log(`Defender ${this.defender.name} has acquired 1000 credits!`);
                console.log(`Attacker ${this.attacker.name} has acquired 750 credits!`)
                this.defender.credits += 1000;
                this.attacker.credits += 750;
            }
            this.round++;
            this.startRound();
        }
    }

    switchSides() {
        console.log("Switching Sides");
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