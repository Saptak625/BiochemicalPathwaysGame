var gameSave = true;

class LocalStorage {
    constructor(objectsDictionary){
        this.objectsDictionary = objectsDictionary;
    }

    save() {
        storeItem("game_started", true);
        for(let name in this.objectsDictionary) {
            storeItem(name, this.objectsDictionary[name]);
        }
    }

    get(name) {
        return getItem(name);
    }

    clear() {
        clearStorage();
    }
}

function saveGame() {
    if(gameSave) {
        storage = new LocalStorage({
            "score": scoreBox.score, 
            "glucose": {"amount": glucose.amount, "show": glucose.show}, 
            "fructose": {"amount": fructose.amount, "show": fructose.show}, 
            "sucrose": {"amount": sucrose.amount, "show": sucrose.show}, 
            "galactose": {"amount": galactose.amount, "show": galactose.show}, 
            "lactose": {"amount": lactose.amount, "show": lactose.show}, 
            "pyruvate": {"amount": pyruvate.amount, "show": pyruvate.show}, 
            "nadh": {"amount": nadh.amount, "show": nadh.show}, 
            "fadh": {"amount": fadh.amount, "show": fadh.show},
            "fructolysis" : fructolysis.show,
            "sucroseHydrolysis": sucroseHydrolysis.show,
            "leloir": leloir.show,
            "lactoseHydrolysis": lactoseHydrolysis.show,
            "fructoseMessage": fructoseMessage.accepted, 
            "sucroseMessage": sucroseMessage.accepted, 
            "galactoseMessage": galactoseMessage.accepted, 
            "lactoseMessage": lactoseMessage.accepted
        });
        storage.save();
    }
}

function retrieveGame() {
    scoreBox.score = storage.get("score");
    [glucose.amount, glucose.show] = [storage.get("glucose").amount, storage.get("glucose").show];
    [fructose.amount, fructose.show] = [storage.get("fructose").amount, storage.get("fructose").show];
    [sucrose.amount, sucrose.show] = [storage.get("sucrose").amount, storage.get("sucrose").show];
    [galactose.amount, galactose.show] = [storage.get("galactose").amount, storage.get("galactose").show];
    [lactose.amount, lactose.show] = [storage.get("lactose").amount, storage.get("lactose").show];
    [pyruvate.amount, pyruvate.show] = [storage.get("pyruvate").amount, storage.get("pyruvate").show];

    [nadh.amount, nadh.show] = [storage.get("nadh").amount, storage.get("nadh").show];
    [fadh.amount, fadh.show] = [storage.get("fadh").amount, storage.get("fadh").show];

    fructolysis.show = storage.get("fructolysis");
    sucroseHydrolysis.show = storage.get("sucroseHydrolysis");
    leloir.show = storage.get("leloir");
    lactoseHydrolysis.show = storage.get("lactoseHydrolysis");

    fructoseMessage.accepted = storage.get("fructoseMessage");
    if(fructoseMessage.accepted) {
        fructoseMessage.action();
    }
    sucroseMessage.accepted = storage.get("sucroseMessage");
    if(sucroseMessage.accepted) {
        sucroseMessage.action();
    }
    galactoseMessage.accepted = storage.get("galactoseMessage");
    if(galactoseMessage.accepted) {
        galactoseMessage.action(false);
    }
    lactoseMessage.accepted = storage.get("lactoseMessage");
    if(lactoseMessage.accepted) {
        lactoseMessage.action(false);
    }
}

function resetGame() {
    new LocalStorage().clear();
    gameSave = false;
    location.reload();
}