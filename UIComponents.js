class UIComponent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.show = true;
    }

    draw() {}
}

class Button extends UIComponent {
    constructor(x, y, sizeX, sizeY) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    draw(fillColor, strokeColor, weight, roundedEdge) {
        fill(fillColor);
        stroke(strokeColor);
        strokeWeight(weight);
        rect(this.x, this.y, this.sizeX, this.sizeY, roundedEdge);
    }

    checkPressed(action = function() {}) {
        if (mouseX >= this.x && mouseX <= this.x + this.sizeX && mouseY >= this.y && mouseY <= this.y + this.sizeY) {
          action();
          return true;
        }
        return false;
    }
    
}

class Navtab extends Button {
    constructor(x, y, sizeX, sizeY, label, fontSize) {
        super(x, y, sizeX, sizeY);
        this.label = label;
        this.fontSize = fontSize;
        this.showUpdate = false;
    }

    draw(state, hover) {
        if(hover) {
            super.draw(16, 0, 2, 8);
        } else if(state) {
            super.draw(8, 0, 2, 8);
        }
        textAlign(CENTER, CENTER);
        textSize(this.fontSize);
        fill(157);
        if(state){
            fill(255);
        }
        noStroke();
        text(this.label, this.x + (this.sizeX/2), this.y + (this.sizeY/2));
        if(this.showUpdate) {
            fill(204, 0, 0);
            ellipse(this.x + this.sizeX - (width/150), this.y + (height/55), 10, 10);
        }
    }
}

class Navbar extends UIComponent {
    constructor(x, y, sizeX, sizeY, tabs, activeTab) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.tabs = {};
        var currentY = y;
        for(let t of tabs){
            this.tabs[t] = new Navtab(this.x, currentY, this.sizeX, this.sizeY, t, 18);
            currentY += sizeY;
        }
        this.activeTab = activeTab;
        this.showUpdate = false;
    }

    draw() {
        fill(34);
        stroke(34);
        strokeWeight(2);
        rect(this.x, this.y, this.sizeX, this.sizeY * Object.keys(this.tabs).length, 8)
        var currentY = this.y;
        for(let t in this.tabs) {
            [this.tabs[t].x, this.tabs[t].y, this.tabs[t].sizeX, this.tabs[t].sizeY] = [this.x, currentY, this.sizeX, this.sizeY];
            this.tabs[t].draw(t == this.activeTab, this.tabs[t].checkPressed());
            currentY += this.sizeY;
        }

        this.tabs["Homeostasis"].showUpdate = this.showUpdate;
    }

    checkPressed() {
      for(let t in this.tabs) {
          if(this.tabs[t].checkPressed()) {
              this.activeTab = t;
              break;
          }
      }
    }
}

class LevelBar extends UIComponent {
    constructor(x, y, sizeX, sizeY, percentageComplete) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.percentageComplete = percentageComplete;
        this.level = 1;
    }

    draw(target) {
        if(this.percentageComplete > 1){
            this.percentageComplete = 1;
        }
        stroke(0);
        fill(34);
        rect(this.x, this.y, this.sizeX, this.sizeY, 4);
        fill(0, 128, 43);
        rect(this.x, this.y, this.sizeX * this.percentageComplete, this.sizeY, 4);
        textAlign(RIGHT, CENTER);
        textSize(18);
        noStroke();
        fill(255);
        var xDimension = this.x + (this.sizeX * this.percentageComplete)-10;
        if(this.percentageComplete < 0.05){
            xDimension += 40;
        }
        text(Math.floor((this.percentageComplete * 100)) + "%", xDimension, this.y + (this.sizeY/2));
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        fill(255);
        text("Level " + this.level, this.x + (this.sizeX/2), this.y + (this.sizeY/2) - 40);
        textStyle(NORMAL);
        if(target > 0){
            text(target + " more ATP", this.x + (this.sizeX/2), this.y + (this.sizeY/2) + 45); 
        }
    }

    levelUp() {
        this.level += 1;
        this.percentageComplete = 0;
    }
}

class Profile extends UIComponent {
    constructor(x, y, diameter, organism) {
        super(x, y);
        this.diameter = diameter;
        this.organism = organism;
    }

    draw(profileImage) {
        cyanobacteriaImage.mask(profileMask);
        image(cyanobacteriaImage, this.x, this.y, this.diameter, this.diameter);
        noFill();
        stroke(255);
        strokeWeight(5);
        ellipse(this.x + (this.diameter/2), this.y + (this.diameter/2), this.diameter, this.diameter);
        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        textStyle(BOLD);
        text(this.organism, this.x + (this.diameter/2), this.y + this.diameter + 15);
        textStyle(NORMAL);
    }
}

class ScoreBox extends UIComponent {
    constructor(x, y, sizeX, sizeY, score) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.score = score;
    }

    draw() {
        fill(8);
        rect(this.x, this.y, this.sizeX, this.sizeY, 15);
        fill(255);
        textSize(26);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.score + " ATP", this.x + (this.sizeX/2), this.y + (this.sizeY/2));
    }

    incrementATP(number) {
        this.score += number;
    }
}

class VerticalScrollBar extends UIComponent {
    constructor(x, y, sizeX, sizeY, yDimension) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.yDimension = yDimension;
        this.yPosition = this.y;
        this.selected = false;
        this.button = new Button(this.x, this.yPosition, this.sizeX, this.sizeY*(this.sizeY/this.yDimension));
    }

    draw() {
        if(this.show){
            fill(100);
            stroke(100);
            strokeWeight(2);
            rect(this.x, this.y, this.sizeX, this.sizeY, this.sizeX/2);
            fill(34);
            noStroke();
            rect(this.x, this.yPosition, this.sizeX, this.sizeY*(this.sizeY/this.yDimension), this.sizeX/2);
        }
    }

    checkPressed() {
        [this.button.x, this.button.y, this.button.sizeX, this.button.sizeY] = [this.x, this.yPosition, this.sizeX, this.sizeY*(this.sizeY/this.yDimension)];
        if(this.show){
            if(mouseIsPressed){
                if(!this.selected){
                    if(this.button.checkPressed()){
                        this.selected = true;
                    }
                }
                if(this.selected) {
                    this.yPosition += movedY;
                    if(this.yPosition < this.y) {
                        this.yPosition = this.y;
                    }
                    if((this.yPosition-this.y) > (this.sizeY-(this.sizeY*(this.sizeY/this.yDimension)))){
                        this.yPosition = this.y + (this.sizeY-(this.sizeY*(this.sizeY/this.yDimension)));
                    }
                }
            }else {
                this.selected = false;
            } 
        }
    }

    scaledYPosition() {
        return (this.yPosition - this.y) * (this.yDimension/this.sizeY);
    }
}

class QuantityBar extends UIComponent {
    constructor(x, y, sizeX, sizeY, label, amount, maxAmount) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.label = label;
        this.amount = amount;
        this.maxAmount = maxAmount;
    }

    draw(c, barColor = 34, disabled = false) {
        if(disabled){
            this.amount = 0; //No green bar allowed.
        }
        if(this.show) {
            c.stroke(0);
            c.fill(barColor);
            c.rect(this.x, this.y, this.sizeX, this.sizeY, this.sizeY/2);
            c.fill(0, 128, 43);
            c.noStroke();
            c.rect(this.x, this.y, this.sizeX * (this.amount / this.maxAmount), this.sizeY, this.sizeY/2);
            c.noStroke();
            c.fill(255);
            c.textSize(18);
            c.textAlign(CENTER, TOP);
            c.text(Math.round(this.amount) + " / " + this.maxAmount, this.x + (this.sizeX/2), this.y + this.sizeY + 20); 
        }
    }

    increment(number) {
        this.amount += number;
        if(this.amount > this.maxAmount) {
            this.amount = this.maxAmount;
        }
    }

    changeCoords(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}

class ReactionUI extends QuantityBar {
    constructor(x, y, sizeX, sizeY, reactionLabel, reactantLabel, productLabel, amount, maxAmount, increment, disabled = function() {false}, reactantImage = null, productImage = null) {
        super(x, y, sizeX, sizeY, reactantLabel, amount, maxAmount);
        this.reactionLabel = reactionLabel;
        this.productLabel = productLabel;
        this.increment = increment;
        this.button = new Button(this.x, this.y, this.sizeX, this.sizeY);
        this.reactantImage = reactantImage;
        this.productImage = productImage;
        this.enzymesMade = true;
        this.disabled = disabled;
    }
  
    draw(c) {
        if(this.show) {
            if(!this.disabled()){
                super.draw(c); 
            } else {
                super.draw(c, 100, true);
            }
            c.stroke(0);
            c.fill(255);
            c.ellipse(this.x + this.sizeY/2, this.y + this.sizeY/2, this.sizeY + 20, this.sizeY + 20);
            c.image(this.reactantImage, this.x, this.y, 60, 60);
            if(this.productLabel !== null){
                c.ellipse(this.x + this.sizeX - this.sizeY/2, this.y + this.sizeY/2, this.sizeY + 20, this.sizeY + 20);
                c.image(this.productImage, this.x + this.sizeX - this.sizeY, this.y, 60, 60);
            }
            c.noStroke();
            c.fill(255);
            c.textSize(18);
            c.textAlign(CENTER, CENTER);
            c.text(this.label, this.x + this.sizeY/2, this.y + this.sizeY + 20);
            if(this.productLabel !== null){
                c.text(this.productLabel, this.x + this.sizeX - this.sizeY/2, this.y + this.sizeY + 20);
            }
            c.textSize(20);
            c.text(this.reactionLabel, this.x + (this.sizeX/2), this.y - 15);
        }
    }

    changeCoords(newX, newY, newButtonX, newButtonY) {
        super.changeCoords(newX, newY);
        [this.button.x, this.button.y, this.button.sizeX, this.button.sizeY] = [newButtonX, newButtonY, this.sizeX, this.sizeY];
    }

    disableEnzymes(action, numOfSeconds) {
        setTimeout(action, numOfSeconds * 1000);
    }
  
    checkPressed(action = function() {}) {
        if(this.show && !this.disabled()){
            if(this.button.checkPressed() && mouseIsPressed === true) {
                this.amount += this.increment;
            }else {
              this.amount = 0;
            }
            if(this.amount >= 100) {
                this.amount = 0;
                action();
            } 
        } 
    }
}

class ProductUI extends QuantityBar {
    constructor(x, y, sizeX, sizeY, label, amount, maxAmount, reactantImage) {
        super(x, y, sizeX, sizeY, label, amount, maxAmount);
        this.reactantImage = reactantImage;
        this.refillStarted = false;
        this.numOfSeconds = null
    }
  
    draw(c) {
        if(this.show) {
            super.draw(c);
            c.stroke(0);
            c.fill(255);
            c.ellipse(this.x + this.sizeY/2, this.y + this.sizeY/2, this.sizeY + 20, this.sizeY + 20);
            c.image(this.reactantImage, this.x, this.y, 60, 60);
            c.noStroke();
            c.fill(255);
            c.textSize(18);
            c.textAlign(CENTER, CENTER);
            c.text(this.label, this.x + this.sizeY/2, this.y + this.sizeY + 20);
        }
    }

    startRefill(action, numOfSeconds){
        this.numOfSeconds = numOfSeconds
        if(!this.refillStarted){
            setInterval(action, numOfSeconds * 1000);
            this.refillStarted = true; 
        }
    }

    fillByTime(timeElapsedInSeconds){
        if(this.numOfSeconds){
            this.increment(timeElapsedInSeconds/this.numOfSeconds) 
        }
    }
}

class CoenzymeUI extends QuantityBar {
    draw(c) {
        if(this.show) {
            super.draw(c);
            c.stroke(0);
            c.fill(255);
            c.ellipse(this.x + this.sizeY/2, this.y + this.sizeY/2, this.sizeY + 20, this.sizeY + 20);
            c.noStroke();
            c.fill(0);
            c.textSize(22);
            c.textAlign(CENTER, CENTER);
            c.text(this.label, this.x + this.sizeY/2, this.y + this.sizeY/2);
        }
    }
}

class QuantityBarColumn extends UIComponent {
    constructor(x, y, sizeX, sizeY, quantityBars) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.quantityBars = quantityBars;
        this.scrollBar = new VerticalScrollBar(this.x + this.sizeX + 15, this.y, 15, this.sizeY, this.sizeY);
        this.graphics = createGraphics(this.sizeX, this.sizeY);
    }

    draw() {
        this.graphics.clear();
        [this.scrollBar.x, this.scrollBar.y, this.scrollBar.sizeX, this.scrollBar.sizeY] = [this.x + this.sizeX + 15, this.y, 15, this.sizeY];
        var yCoord = 30 - this.scrollBar.scaledYPosition();
        var startYCoord = yCoord;
        for(let q of this.quantityBars) {
            if(!q.show){
                continue;
            }
            q.changeCoords(width * 0.05, yCoord, this.x, this.y + yCoord);
            q.draw(this.graphics);
            yCoord += 150;
        }
        image(this.graphics, this.x, this.y);
        this.scrollBar.show = (yCoord - startYCoord) > this.scrollBar.sizeY;
        this.scrollBar.yDimension = yCoord - startYCoord;
        this.scrollBar.draw();
    }

    resizeCanvas(){
        this.graphics = createGraphics(this.sizeX, this.sizeY);
    }
}

class HomeostasisMessage extends UIComponent {
    constructor(x, y, sizeX, sizeY, message, actionMessage, action) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.message = message;
        this.actionMessage = actionMessage;
        this.action = action;
        this.button = new Button(this.x + this.sizeX - 250, this.y + 20, 230, this.sizeY-40);
        this.accepted = false;
    }

    draw() {
        if(this.show){
            noStroke();
            fill(34);
            rect(this.x, this.y, this.sizeX, this.sizeY, 6);
            fill(8);
            rect(this.x + this.sizeX - 250, this.y + 20, 230, this.sizeY-40, 6);
            fill(255);
            textAlign(LEFT, CENTER);
            textSize(24);
            text(this.message, this.x + 20, this.y + (this.sizeY/2));
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.actionMessage, this.x + this.sizeX - 250 + (230/2), this.y + 20 + ((this.sizeY - 40)/2));
        }
    }

    checkPressed() {
        if(this.show && this.button.checkPressed()) {
            this.show = false;
            this.accepted = true;
            this.action();
        }
    }

    changeCoords(newX, newY) {
        this.x = newX;
        this.y = newY;
        [this.button.x, this.button.y, this.button.sizeX, this.button.sizeY] = [this.x + this.sizeX - 250, this.y + 20, 230, this.sizeY-40];
    }
}

class MessageColumn extends UIComponent {
    constructor(x, y, sizeX, sizeY, messages) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.messages = messages;
    }

    draw() {
        var yCoord = this.y;
        for(let m of this.messages) {
            if(!m.show){
                continue;
            }
            m.changeCoords(this.x, yCoord);
            m.draw();
            yCoord += 150;
        }
        if(yCoord === this.y) { //No Messages
            textAlign(CENTER, CENTER);
            fill(255);
            textSize(32);
            text("No Issues with Homeostasis!", this.x + (this.sizeX/2), this.y + 50);
        }
    }
}