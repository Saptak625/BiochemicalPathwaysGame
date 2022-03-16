//Images
let backgroundImage;
let cyanobacteriaImage;
let profileMask;

let glucoseImage;
let pyruvateImage;
let fructoseImage;
let sucroseImage;
let nadhImage;

//UI Components
let canvas;

let navbar;
let levelBar;
let profile;
let scoreBox;

let reactions;
let sucroseHydrolysis;
let glycolysis;
let fructolysis
let krebs;
let etc;

let inventory;
let glucose;
let fructose;
let pyruvate;

let nadh;
let fadh;

let fructoseMessage;
let sucroseMessage;
let messageColumn;

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
    reactions = new QuantityBarColumn(width * 0.2, height * 0.2, width * 0.6, height * 0.75, [sucroseHydrolysis, glycolysis, fructolysis, krebs, etc]);

    glucose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Glucose", 10, 500, glucoseImage);
    glucose.startRefill(function () {
      glucose.increment(1);
    }, 12);
    pyruvate = new ProductUI(width * 0.25, 350, width * 0.5, 60, "Pyruvate", 0, 500, pyruvateImage);
    fructose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Fructose", 10, 500, fructoseImage);
    fructose.show = false;
    sucrose = new ProductUI(width * 0.25, 200, width * 0.5, 60, "Sucrose", 10, 500, sucroseImage);
    sucrose.show = false;
    inventory = new QuantityBarColumn(width * 0.2, height * 0.2, width * 0.6, height * 0.75, [glucose, fructose, sucrose, pyruvate]);
  
    nadh = new CoenzymeUI(width * 0.25, 200, width * 0.5, 60, "NADH", 0, 500);
    fadh = new CoenzymeUI(width * 0.25, 350, width * 0.5, 60, "FADH2", 0, 500);
    coenzymes = new QuantityBarColumn(width * 0.2, height * 0.2, width * 0.6, height * 0.75, [nadh, fadh]);
    // localStorage.setItem("lastname", "Smith");

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

    messageColumn = new MessageColumn(width * 0.25, 200, width * 0.5, 700, [fructoseMessage, sucroseMessage]);
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
    }

    //Level Dynamics
    var previousTarget = 0;
    for (let i = 0; i < levelBar.level; i++) {
        previousTarget += levelTargets[i];
    }
    var target = previousTarget + levelTargets[levelBar.level];
    while(scoreBox.score >= target) {
        if(levelBar.level < (levelTargets.length-1)){
          levelBar.levelUp();
          previousTarget = 0;
          for (let i = 0; i < levelBar.level; i++) {
              previousTarget += levelTargets[i];
          }
          target = previousTarget + levelTargets[levelBar.level];
          navbar.showUpdate = true;
          messageColumn.messages[levelBar.level - 2].show = true;
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
  
    //Notification
    navbar.showUpdate = messageColumn.checkForMessages();
  
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
            break;
    }
}

function mouseClicked() {
    navbar.checkPressed();
    fructoseMessage.checkPressed();
    sucroseMessage.checkPressed();
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
    [reactions.x, reactions.y, reactions.sizeX, reactions.sizeY] = [width * 0.2, height * 0.2, width * 0.6, height * 0.75];

    [glucose.x, glucose.y, glucose.sizeX, glucose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [pyruvate.x, pyruvate.y, pyruvate.sizeX, pyruvate.sizeY] = [width * 0.25, 350, width * 0.5, 60];
    [fructose.x, fructose.y, fructose.sizeX, fructose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [sucrose.x, sucrose.y, sucrose.sizeX, sucrose.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [inventory.x, inventory.y, inventory.sizeX, inventory.sizeY] = [width * 0.2, height * 0.2, width * 0.6, height * 0.75];

    [nadh.x, nadh.y, nadh.sizeX, nadh.sizeY] = [width * 0.25, 200, width * 0.5, 60];
    [fadh.x, fadh.y, fadh.sizeX, fadh.sizeY] = [width * 0.25, 350, width * 0.5, 60];
    [coenzymes.x, coenzymes.y, coenzymes.sizeX, coenzymes.sizeY] = [width * 0.2, height * 0.2, width * 0.6, height * 0.75];

    [fructoseMessage.x, fructoseMessage.y, fructoseMessage.sizeX, fructoseMessage.sizeY] = [width * 0.25, 200, width * 0.5, 100];
    [sucroseMessage.x, sucroseMessage.y, sucroseMessage.sizeX, sucroseMessage.sizeY] = [width * 0.25, 200, width * 0.5, 100];

    [messageColumn.x, messageColumn.y, messageColumn.sizeX, messageColumn.sizeY] = [width * 0.25, 200, width * 0.5, 700];
}