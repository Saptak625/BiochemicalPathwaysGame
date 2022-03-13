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

let levelTargets = [0, 500, 1750, 5000];
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
    navbar = new Navbar(60 + (displayWidth/20), 250, 150, 60, ["Reactions", "Inventory", "Coenzymes", "Homeostasis", "Pathways"], "Reactions");
    levelBar = new LevelBar((displayWidth - 800)/2, 50, 800, 60, 0);
    profile = new Profile(90 + (displayWidth/20), 30, 100, "E. Coli");
    scoreBox = new ScoreBox(displayWidth - 300, 50, 200, 60, 0);


    glycolysis = new ReactionUI((displayWidth - 800)/2, 200, 800, 60, "Glycolysis", "Glucose", "Pyruvate + NADH", 0, 100, 2, function () {
      return glucose.amount < 1;
    }, reactantImage = glucoseImage, productImage = pyruvateImage);
    krebs = new ReactionUI((displayWidth - 800)/2, 350, 800, 60, "Kreb's Cycle", "Pyruvate", "NADH + FADH2", 0, 100, 2, function () {
      return pyruvate.amount < 2;
    }, reactantImage = pyruvateImage, productImage = nadhImage);
    etc = new ReactionUI((displayWidth - 800)/2, 500, 800, 60, "Electron Transport Chain", "NADH + FADH2", null, 0, 100, 2, function () {
      return nadh.amount < 10 || fadh.amount < 2;
    }, reactantImage = nadhImage);
    fructolysis = new ReactionUI((displayWidth - 800)/2, 650, 800, 60, "Fructolysis", "Fructose", "Pyruvate + NADH", 0, 100, 4, function () {
      return fructose.amount < 1;
    }, reactantImage = fructoseImage, productImage = pyruvateImage);
    fructolysis.show = false;
    sucroseHydrolysis = new ReactionUI((displayWidth - 800)/2, 650, 800, 60, "Sucrose Hydrolysis", "Sucrose", "Glucose + Fructose", 0, 100, 1, function () {
      return sucrose.amount < 1;
    }, reactantImage = sucroseImage, productImage = glucoseImage);
    sucroseHydrolysis.show = false;
    reactions = new QuantityBarColumn((displayWidth - 900)/2, 200, 900, 700, [sucroseHydrolysis, glycolysis, fructolysis, krebs, etc]);

    glucose = new ProductUI((displayWidth - 800)/2, 200, 800, 60, "Glucose", 10, 500, glucoseImage);
    glucose.startRefill(function () {
      glucose.increment(1);
    }, 12);
    pyruvate = new ProductUI((displayWidth - 800)/2, 350, 800, 60, "Pyruvate", 0, 500, pyruvateImage);
    fructose = new ProductUI((displayWidth - 800)/2, 200, 800, 60, "Fructose", 10, 500, fructoseImage);
    fructose.show = false;
    sucrose = new ProductUI((displayWidth - 800)/2, 200, 800, 60, "Sucrose", 10, 500, sucroseImage);
    sucrose.show = false;
    inventory = new QuantityBarColumn((displayWidth - 900)/2, 200, 900, 700, [glucose, fructose, sucrose, pyruvate]);
  
    nadh = new CoenzymeUI((displayWidth - 800)/2, 200, 800, 60, "NADH", 0, 500);
    fadh = new CoenzymeUI((displayWidth - 800)/2, 350, 800, 60, "FADH2", 0, 500);
    coenzymes = new QuantityBarColumn((displayWidth - 900)/2, 200, 900, 700, [nadh, fadh]);
    // localStorage.setItem("lastname", "Smith");

    fructoseMessage = new HomeostasisMessage((displayWidth - 800)/2, 200, 800, 100, "Fructose Sugar found!", "Unlock Fructose Pathway", function () {
      fructose.show = true;
      fructolysis.show = true;
      fructose.startRefill(function () {
        fructose.increment(1);
      }, 30);
    });
    fructoseMessage.show = false;

    sucroseMessage = new HomeostasisMessage((displayWidth - 800)/2, 200, 800, 100, "Sucrose Sugar found!", "Unlock Sucrose Pathway", function () {
      sucrose.show = true;
      sucroseHydrolysis.show = true;
      sucrose.startRefill(function () {
        sucrose.increment(1);
      }, 60);
    });
    sucroseMessage.show = false;

    messageColumn = new MessageColumn((displayWidth - 800)/2, 200, 800, 700, [fructoseMessage, sucroseMessage]);
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
}