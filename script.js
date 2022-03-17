//Images
let backgroundImage;
let cyanobacteriaImage;
let profileMask;

let glucoseImage;
let pyruvateImage;
let fructoseImage;
let sucroseImage;
let galactoseImage;
let lactoseImage;
let nadhImage;

//UI Components
let canvas;

let navbar;
let levelBar;
let profile;
let scoreBox;

let reactions;
let sucroseHydrolysis;
let lactoseHydrolysis;
let leloir;
let glycolysis;
let fructolysis;
let krebs;
let etc;

let inventory;
let glucose;
let fructose;
let sucrose;
let galactose;
let lactose;
let pyruvate;

let nadh;
let fadh;

let fructoseMessage;
let sucroseMessage;
let galactoseMessage;
let lactoseMessage;
let messageColumn;

var previousTarget = 0;
let levelTargets = [0, 500, 1750, 4000, 10000, 30000];
let messageToShow;

function preload() {
    backgroundImage = loadImage("assets/background.png");
    cyanobacteriaImage = loadImage("assets/ecoli.jpg");
    profileMask = loadImage("assets/profileMask.png");

    glucoseImage = loadImage("assets/glucose.png");
    pyruvateImage = loadImage("assets/pyruvate.svg");
    fructoseImage = loadImage("assets/fructose.png");
    sucroseImage = loadImage("assets/sucrose.png");
    galactoseImage = loadImage("assets/galactose.png");
    lactoseImage = loadImage("assets/lactose.png");

    nadhImage = loadImage("assets/nadh.png");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    navbar = new Navbar(width * 0.05, height * 0.3, width * 0.1, 60, ["Reactions", "Inventory", "Coenzymes", "Homeostasis", "Pathways"], "Reactions");
    levelBar = new LevelBar(width * 0.25, height * 0.07, width * 0.5, 60, 0);
    profile = new Profile(width * 0.07, height * 0.05, 100, "E. Coli");
    scoreBox = new ScoreBox(width * 0.81, height * 0.07, width * 0.13, 60, 0);


    glycolysis = new ReactionUI(windowWidth * 0.25, 200, windowWidth * 0.5, 60, "Glycolysis", "Glucose", "Pyruvate + NADH", 0, 100, 2, function () {
      return glucose.amount < 1;
    }, reactantImage = glucoseImage, productImage = pyruvateImage);
    krebs = new ReactionUI(width * 0.25, 350, width * 0.5, 60, "Kreb's Cycle", "Pyruvate", "NADH + FADH2", 0, 100, 2, function () {
      return pyruvate.amount < 2;
    }, reactantImage = pyruvateImage, productImage = nadhImage);
    etc = new ReactionUI(width * 0.25, 500, width * 0.5, 60, "Electron Transport Chain", "NADH + FADH2", null, 0, 100, 2, function () {
      return nadh.amount < 10 || fadh.amount < 2;
    }, reactantImage = nadhImage);
    fructolysis = new ReactionUI(width * 0.25, 650, width * 0.5, 60, "Fructolysis", "Fructose", "Pyruvate + NADH", 0, 100, 4, function () {
      return fructose.amount < 1;
    }, reactantImage = fructoseImage, productImage = pyruvateImage);
    fructolysis.show = false;
    sucroseHydrolysis = new ReactionUI(width * 0.25, 650, width * 0.5, 60, "Sucrose Hydrolysis", "Sucrose", "Glucose + Fructose", 0, 100, 1, function () {
      return sucrose.amount < 1;
    }, reactantImage = sucroseImage, productImage = glucoseImage);
    sucroseHydrolysis.show = false;
    leloir = new ReactionUI(width * 0.25, 650, width * 0.5, 60, "Leloir Pathway", "Galactose", "Glucose", 0, 100, 0.5, function () {
      return galactose.amount < 1 || !leloir.enzymesMade;
    }, reactantImage = galactoseImage, productImage = glucoseImage);
    leloir.show = false;
    lactoseHydrolysis = new ReactionUI(width * 0.25, 650, width * 0.5, 60, "Lactose Hydrolysis", "Lactose", "Glucose + Galactose", 0, 100, 0.5, function () {
      return lactose.amount < 1;
    }, reactantImage = lactoseImage, productImage = glucoseImage);
    lactoseHydrolysis.show = false;
    reactions = new QuantityBarColumn(width * 0.2, height * 0.2, width * 0.6, height * 0.75, [sucroseHydrolysis, lactoseHydrolysis, leloir, glycolysis, fructolysis, krebs, etc]);

    glucose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Glucose", 10, 100, glucoseImage);
    glucose.startRefill(function () {
      glucose.increment(1);
    }, 12);
    pyruvate = new ProductUI(width * 0.25, 350, width * 0.5, 60, "Pyruvate", 0, 100, pyruvateImage);
    fructose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Fructose", 10, 100, fructoseImage);
    fructose.show = false;
    sucrose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Sucrose", 10, 100, sucroseImage);
    sucrose.show = false;
    galactose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Galactose", 10, 100, galactoseImage);
    galactose.show = false;
    lactose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Lactose", 10, 100, lactoseImage);
    lactose.show = false;
    inventory = new QuantityBarColumn(width * 0.2, height * 0.2, width * 0.6, height * 0.75, [glucose, fructose, sucrose, galactose, lactose, pyruvate]);
  
    nadh = new CoenzymeUI(width * 0.25, 200, width * 0.5, 60, "NADH", 0, 500);
    fadh = new CoenzymeUI(width * 0.25, 350, width * 0.5, 60, "FADH2", 0, 500);
    coenzymes = new QuantityBarColumn(width * 0.2, height * 0.2, width * 0.6, height * 0.75, [nadh, fadh]);

    fructoseMessage = new HomeostasisMessage(width * 0.25, 200, width * 0.5, 100, "Fructose Sugar found!", "Unlock Fructose Pathway", function () {
      fructose.show = true;
      fructolysis.show = true;
      fructose.startRefill(function () {
        fructose.increment(1);
      }, 30);
    });
    fructoseMessage.show = false;

    sucroseMessage = new HomeostasisMessage(width * 0.25, 200, width * 0.5, 100, "Sucrose Sugar found!", "Unlock Sucrose Pathway", function () {
      sucrose.show = true;
      sucroseHydrolysis.show = true;
      sucrose.startRefill(function () {
        sucrose.increment(1);
      }, 60);
    });
    sucroseMessage.show = false;

    galactoseMessage = new HomeostasisMessage(width * 0.25, 200, width * 0.5, 100, "Galactose Sugar Building Up!", "Turn On Gal Operon", function () {
      galactose.show = true;
      leloir.show = true;
      leloir.enzymesMade = true;
      leloir.disableEnzymes(function () {
          leloir.enzymesMade = false;
      }, 60);
      galactose.startRefill(function () {
        galactose.increment(1);
      }, 150);
    });
    galactoseMessage.show = false;
  
    lactoseMessage = new HomeostasisMessage(width * 0.25, 200, width * 0.5, 100, "Lactose Sugar Building Up!", "Turn On Lac Operon", function () {
      lactose.show = true;
      lactoseHydrolysis.show = true;
      lactoseHydrolysis.enzymesMade = true;
      lactoseHydrolysis.disableEnzymes(function () {
          lactoseHydrolysis.enzymesMade = false;
      }, 60);
      lactose.startRefill(function () {
        lactose.increment(1);
      }, 300);
    });
    lactoseMessage.show = false;
  
    messageColumn = new MessageColumn(width * 0.25, 200, width * 0.5, 700, [fructoseMessage, sucroseMessage, galactoseMessage, lactoseMessage]);

    storage = new LocalStorage();
    if(storage.get("game_started") !== null) {
        console.log("hello");
        retrieveGame();
    }
}

function draw() {
    background(backgroundImage);
  
    //UPDATE BEFORE DRAW
    //Held mouse interactions
    if(!reactions.scrollBar.selected){
        glycolysis.checkPressed(function () {
            glucose.increment(-1);
            pyruvate.increment(2);
            nadh.increment(2);
            scoreBox.incrementATP(2);
        }); 
        krebs.checkPressed(function () {
            pyruvate.increment(-2);
            nadh.increment(8);
            fadh.increment(2);
            scoreBox.incrementATP(2);
        }); 
        etc.checkPressed(function () {
            nadh.increment(-10);
            fadh.increment(-2);
            scoreBox.incrementATP(32);
        });
        fructolysis.checkPressed(function () {
            fructose.increment(-1);
            pyruvate.increment(2);
            nadh.increment(2);
            scoreBox.incrementATP(2);
        }); 
        sucroseHydrolysis.checkPressed(function () {
            sucrose.increment(-1);
            glucose.increment(1);
            fructose.increment(1);
        });
        leloir.checkPressed(function () {
            galactose.increment(-1);
            glucose.increment(1);
        });
        lactoseHydrolysis.checkPressed(function () {
            lactose.increment(-1);
            glucose.increment(1);
            galactose.increment(1);
        });
    }

    //Enzyme Alerts
    if(galactose.amount > 10 && !leloir.enzymesMade) { //Alert if greater than threshold and enzymes stopped functioning.
        navbar.showUpdate = true;
        galactoseMessage.show = true;
    }
    if(lactose.amount > 10 && !lactoseHydrolysis.enzymesMade) { //Alert if greater than threshold and enzymes stopped functioning.
        navbar.showUpdate = true;
        lactoseMessage.show = true;
    }
  
    //Level Dynamics
    var target = previousTarget + levelTargets[levelBar.level];
    while(scoreBox.score >= target) {
        if(levelBar.level < (levelTargets.length-1)){
          levelBar.levelUp();
          previousTarget += levelTargets[levelBar.level-1];
          target = previousTarget + levelTargets[levelBar.level];
          if(!messageColumn.messages[levelBar.level - 2].accepted) {
            navbar.showUpdate = true;
            messageColumn.messages[levelBar.level - 2].show = true;
          }
        }else{
          break;
        }
    }
  
    //Level Bar Calculation
    levelBar.percentageComplete = (scoreBox.score - previousTarget) / levelTargets[levelBar.level]; 
  
    //Draw UI Components
    profile.draw(cyanobacteriaImage);
    navbar.draw();
    levelBar.draw(target - scoreBox.score);
    scoreBox.draw();
  
    switch (navbar.activeTab){
        case "Reactions":
            reactions.scrollBar.checkPressed();
            reactions.draw();
            break;

        case "Inventory":
            inventory.scrollBar.checkPressed();
            inventory.draw();
            break;
        
        case "Coenzymes":
            coenzymes.scrollBar.checkPressed();
            coenzymes.draw();
            break;

        case "Homeostasis":
            messageColumn.draw();
            navbar.showUpdate = false;
            break;
    }
}

function mouseClicked() {
    navbar.checkPressed();
    fructoseMessage.checkPressed();
    sucroseMessage.checkPressed();
    galactoseMessage.checkPressed();
    lactoseMessage.checkPressed();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resizeUI();
}

function resizeUI() { //Dynamic Responsive UI
    [navbar.x, navbar.y, navbar.sizeX, navbar.sizeY] = [width * 0.05, height * 0.3, width * 0.1, 60];
    [levelBar.x, levelBar.y, levelBar.sizeX, levelBar.sizeY] = [width * 0.25, height * 0.07, width * 0.5, 60];
    [profile.x, profile.y] = [width * 0.07, height * 0.05];
    [scoreBox.x, scoreBox.y, scoreBox.sizeX, scoreBox.sizeY] = [width * 0.81, height * 0.07, width * 0.13, 60];

    [glycolysis.x, glycolysis.y, glycolysis.sizeX, glycolysis.sizeY] = [windowWidth * 0.25, 200, windowWidth * 0.5, 60];
    [krebs.x, krebs.y, krebs.sizeX, krebs.sizeY] = [width * 0.25, 350, width * 0.5, 60];   
    [etc.x, etc.y, etc.sizeX, etc.sizeY] = [width * 0.25, 500, width * 0.5, 60];
    [fructolysis.x, fructolysis.y, fructolysis.sizeX, fructolysis.sizeY] = [width * 0.25, 650, width * 0.5, 60];
    [sucroseHydrolysis.x, sucroseHydrolysis.y, sucroseHydrolysis.sizeX, sucroseHydrolysis.sizeY] = [width * 0.25, 650, width * 0.5, 60];
    [leloir.x, leloir.y, leloir.sizeX, leloir.sizeY] = [width * 0.25, 650, width * 0.5, 60];
    [lactoseHydrolysis.x, lactoseHydrolysis.y, lactoseHydrolysis.sizeX, lactoseHydrolysis.sizeY] = [width * 0.25, 650, width * 0.5, 60];
    [reactions.x, reactions.y, reactions.sizeX, reactions.sizeY] = [width * 0.2, height * 0.2, width * 0.6, height * 0.75];
    reactions.resizeCanvas();

    [glucose.x, glucose.y, glucose.sizeX, glucose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [pyruvate.x, pyruvate.y, pyruvate.sizeX, pyruvate.sizeY] = [width * 0.25, 350, width * 0.5, 60];
    [fructose.x, fructose.y, fructose.sizeX, fructose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [sucrose.x, sucrose.y, sucrose.sizeX, sucrose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [galactose.x, galactose.y, galactose.sizeX, galactose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [lactose.x, lactose.y, lactose.sizeX, lactose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [inventory.x, inventory.y, inventory.sizeX, inventory.sizeY] = [width * 0.2, height * 0.2, width * 0.6, height * 0.75];
    inventory.resizeCanvas();

    [nadh.x, nadh.y, nadh.sizeX, nadh.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [fadh.x, fadh.y, fadh.sizeX, fadh.sizeY] = [width * 0.25, 350, width * 0.5, 60];
    [coenzymes.x, coenzymes.y, coenzymes.sizeX, coenzymes.sizeY] = [width * 0.2, height * 0.2, width * 0.6, height * 0.75];
    coenzymes.resizeCanvas();

    [fructoseMessage.x, fructoseMessage.y, fructoseMessage.sizeX, fructoseMessage.sizeY] = [width * 0.25, 200, width * 0.5, 100];
    [sucroseMessage.x, sucroseMessage.y, sucroseMessage.sizeX, sucroseMessage.sizeY] = [width * 0.25, 200, width * 0.5, 100];
    [galactoseMessage.x, galactoseMessage.y, galactoseMessage.sizeX, galactoseMessage.sizeY] = [width * 0.25, 200, width * 0.5, 100];
    [lactoseMessage.x, lactoseMessage.y, lactoseMessage.sizeX, lactoseMessage.sizeY] = [width * 0.25, 200, width * 0.5, 100];
    [messageColumn.x, messageColumn.y, messageColumn.sizeX, messageColumn.sizeY] = [width * 0.25, 200, width * 0.5, 700];
}