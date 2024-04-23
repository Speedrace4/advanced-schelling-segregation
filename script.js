let similarSlider;
let similarity;
let similarText;
let similarDiv;

let redRatioSlider;
let redRatio;
let redRatioText;
let redRatioDiv;
let redOuterDiv;
let redButton;
let redFix = true;

let blueRatioSlider;
let blueRatio;
let blueRatioText;
let blueRatioDiv;
let blueOuterDiv;
let blueButton;
let blueFix = true;

let greenRatioSlider;
let greenRatio;
let greenRatioText;
let greenRatioDiv;
let greenOuterDiv;
let greenButton;
let greenFix = false;

let yellowRatioSlider;
let yellowRatio;
let yellowRatioText;
let yellowRatioDiv;
let yellowOuterDiv;
let yellowButton;
let yellowFix = false;

let activatedSliders = 2;

let emptySlider;
let empty;
let emptyText;
let emptyDiv;

let sizeSlider;
let size;
let sizeText;
let sizeDiv;

let delaySlider;
let delay;
let delayText;
let delayDiv;

let startButton;
let stopButton;
let resetButton;
let stepButton;

let buttonDiv;
let sliderDiv;
let allRatios;
let overallDiv;

let round;
let satisfied;

let randomColors = [];

let rectSize;

let playing = false;

let canvasSize = 650;

let allRects = [];

let globalInterval;

let globalIteration = 0;

let satisfiedPercent = 0;

let totalRaces = 2;

class House {
    constructor(rect, color, i, j) {
        this.rect = rect;
        this.color = color;
        this.i = i;
        this.j = j;
        this.coord = (i+1)*(j+1);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomElement(arr) {
    let randomIndex = getRandomInt(arr.length);
    let index = arr[randomIndex]
    arr = arr.splice(randomIndex, 1)
    return arr, index;
}

function setup() {
    round = document.getElementById("round");
    satisfied = document.getElementById("satisfied");

    overallDiv = document.getElementById("ultimateDiv");

    buttonDiv = createDiv();
    buttonDiv.id("button");
    buttonDiv.parent(overallDiv);

    sliderDiv = createDiv();
    sliderDiv.id("slider");
    sliderDiv.parent(overallDiv);

    similarDiv = createDiv();
    similarDiv.id("similarDiv");
    similarDiv.parent("slider");
    similarSlider = createSlider(0, 100, 30, 1);
    similarity = similarSlider.value();
    similarText = document.createElement('div');
    similarText.innerHTML = "Similarity: " + str(similarity) + "%";
    document.getElementById('similarDiv').appendChild(similarText);
    similarSlider.parent("similarDiv")

    emptyDiv = createDiv();
    emptyDiv.id("emptyDiv");
    emptyDiv.parent("slider");
    emptySlider = createSlider(0, 100, 10, 1);
    emptySlider.mouseReleased(reset);
    empty = emptySlider.value();
    emptyText = document.createElement('div');
    emptyText.innerHTML = "Empty: " + str(empty) + "%";
    document.getElementById('emptyDiv').appendChild(emptyText);
    emptySlider.parent("emptyDiv")

    sizeDiv = createDiv();
    sizeDiv.id("sizeDiv");
    sizeDiv.parent("slider");
    sizeSlider = createSlider(10, 80, 50, 1);
    sizeSlider.mouseReleased(reset);
    size = sizeSlider.value();
    sizeText = document.createElement('div');
    sizeText.innerHTML = "Size: " + str(size) + "x" + str(size);
    document.getElementById('sizeDiv').appendChild(sizeText);
    sizeSlider.parent("sizeDiv")

    delayDiv = createDiv();
    delayDiv.id("delayDiv");
    delayDiv.parent("slider");
    delaySlider = createSlider(1, 3000, 100, 1);
    delay = delaySlider.value();
    delayText = document.createElement('div');
    delayText.innerHTML = "Delay: " + str(delay) + " ms";
    document.getElementById('delayDiv').appendChild(delayText);
    delaySlider.parent("delayDiv")

    redOuterDiv = createDiv();
    redOuterDiv.id("redOuterDiv");
    redOuterDiv.parent("slider");
    redRatioDiv = createDiv();
    redRatioDiv.id("redRatioDiv");
    redRatioDiv.parent("redOuterDiv");
    redRatioSlider = createSlider(0, 100, 50, 1);
    redRatioSlider.mouseReleased(adjustRedProportion);
    redRatio = redRatioSlider.value();
    redRatioText = document.createElement('div');
    redRatioText.innerHTML = "Red Proportion: " + str(redRatio) + "%";
    document.getElementById('redRatioDiv').appendChild(redRatioText);
    redRatioSlider.parent("redRatioDiv")
    redButton = createButton('Fix');
    redButton.mousePressed(adjustRed);
    redButton.parent("redOuterDiv")

    blueOuterDiv = createDiv();
    blueOuterDiv.id("blueOuterDiv");
    blueOuterDiv.parent("slider");
    blueRatioDiv = createDiv();
    blueRatioDiv.id("blueRatioDiv");
    blueRatioDiv.parent("blueOuterDiv");
    blueRatioSlider = createSlider(0, 100, 50, 1);
    blueRatioSlider.mouseReleased(adjustBlueProportion);
    blueRatio = blueRatioSlider.value();
    blueRatioText = document.createElement('div');
    blueRatioText.innerHTML = "Blue Proportion: " + str(blueRatio) + "%";
    document.getElementById('blueRatioDiv').appendChild(blueRatioText);
    blueRatioSlider.parent("blueRatioDiv")
    blueButton = createButton('Fix');
    blueButton.mousePressed(adjustBlue);
    blueButton.parent("blueOuterDiv")

    greenOuterDiv = createDiv();
    greenOuterDiv.id("greenOuterDiv");
    greenOuterDiv.parent("slider");
    greenRatioDiv = createDiv();
    greenRatioDiv.id("greenRatioDiv");
    greenRatioDiv.parent("greenOuterDiv");
    greenRatioSlider = createSlider(0, 100, 0, 1);
    greenRatioSlider.mouseReleased(adjustGreenProportion);
    greenRatio = greenRatioSlider.value();
    greenRatioText = document.createElement('div');
    greenRatioText.innerHTML = "Green Proportion: " + str(greenRatio) + "%";
    document.getElementById('greenRatioDiv').appendChild(greenRatioText);
    greenRatioSlider.parent("greenRatioDiv")
    greenButton = createButton('Unfix');
    greenButton.mousePressed(adjustGreen);
    greenButton.parent("greenOuterDiv")
    greenRatioSlider.attribute("disabled", "disabled");

    yellowOuterDiv = createDiv();
    yellowOuterDiv.id("yellowOuterDiv");
    yellowOuterDiv.parent("slider");
    yellowRatioDiv = createDiv();
    yellowRatioDiv.id("yellowRatioDiv");
    yellowRatioDiv.parent("yellowOuterDiv");
    yellowRatioSlider = createSlider(0, 100, 0, 1);
    yellowRatioSlider.mouseReleased(adjustYellowProportion);
    yellowRatio = yellowRatioSlider.value();
    yellowRatioText = document.createElement('div');
    yellowRatioText.innerHTML = "Yellow Proportion: " + str(yellowRatio) + "%";
    document.getElementById('yellowRatioDiv').appendChild(yellowRatioText);
    yellowRatioSlider.parent("yellowRatioDiv")
    yellowButton = createButton('Unfix');
    yellowButton.mousePressed(adjustYellow);
    yellowButton.parent("yellowOuterDiv")
    yellowRatioSlider.attribute("disabled", "disabled");

    startButton = createButton('Start');
    startButton.mousePressed(startSimulation);
    stopButton = createButton('Stop');
    stopButton.mousePressed(stopSimulation);
    resetButton = createButton('Reset');
    resetButton.mousePressed(reset);
    stepButton = createButton('Step');
    stepButton.mousePressed(stepSimulation);

    startButton.parent("button");
    stopButton.parent("button");
    stopButton.attribute("disabled", "disabled");
    resetButton.parent("button");
    stepButton.parent("button");
    reset();
}

function adjustRedProportion() {
    let totalProportion = 100;
    if(!blueFix){
        totalProportion -= blueRatio;
    }
    if(!greenFix){
        totalProportion -= greenRatio;
    }
    if(!yellowFix){
        totalProportion -= yellowRatio;
    }
    if(redRatio > totalProportion){
        redRatio = totalProportion;
        redRatioSlider.value(redRatio);
    }
    totalProportion -= redRatio;

    if(blueFix && greenFix && yellowFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - blueRatio - greenRatio;
        blueRatioSlider.value(blueRatio);
        greenRatioSlider.value(greenRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(blueFix && greenFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatioSlider.value(blueRatio);
        greenRatio = totalProportion - blueRatio;
        blueRatioSlider.value(blueRatio);
        greenRatioSlider.value(greenRatio);
    }
    if(yellowFix && greenFix){
        greenRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - greenRatio;
        greenRatioSlider.value(greenRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(yellowFix && blueFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - blueRatio;
        blueRatioSlider.value(blueRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(blueFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatioSlider.value(blueRatio);
    }
    if(greenFix){
        greenRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatioSlider.value(greenRatio);
    }
    if(yellowFix){
        yellowRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatioSlider.value(yellowRatio);
    }
    reset();
}

function adjustBlueProportion() {
    let totalProportion = 100;
    if(!redFix){
        totalProportion -= redRatio;
    }
    if(!greenFix){
        totalProportion -= greenRatio;
    }
    if(!yellowFix){
        totalProportion -= yellowRatio;
    }
    if(blueRatio > totalProportion){
        blueRatio = totalProportion;
        blueRatioSlider.value(blueRatio);
    }
    totalProportion -= blueRatio;

    if(redFix && greenFix && yellowFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - redRatio - greenRatio;
        redRatioSlider.value(redRatio);
        greenRatioSlider.value(greenRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(redFix && greenFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatio = totalProportion - redRatio;
        redRatioSlider.value(redRatio);
        greenRatioSlider.value(greenRatio);
    }
    if(yellowFix && greenFix){
        greenRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - greenRatio;
        greenRatioSlider.value(greenRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(yellowFix && redFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - redRatio;
        redRatioSlider.value(redRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(redFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        redRatioSlider.value(redRatio);
    }
    if(greenFix){
        greenRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatioSlider.value(greenRatio);
    }
    if(yellowFix){
        yellowRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatioSlider.value(yellowRatio);
    }
    reset();
}

function adjustGreenProportion() {
    let totalProportion = 100;
    if(!redFix){
        totalProportion -= redRatio;
    }
    if(!blueFix){
        totalProportion -= blueRatio;
    }
    if(!yellowFix){
        totalProportion -= yellowRatio;
    }
    if(greenRatio > totalProportion){
        greenRatio = totalProportion;
        greenRatioSlider.value(greenRatio);
    }
    totalProportion -= greenRatio;

    if(redFix && blueFix && yellowFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - redRatio - blueRatio;
        redRatioSlider.value(redRatio);
        blueRatioSlider.value(blueRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(redFix && blueFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatio = totalProportion - redRatio;
        redRatioSlider.value(redRatio);
        blueRatioSlider.value(blueRatio);
    }
    if(yellowFix && blueFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - blueRatio;
        blueRatioSlider.value(blueRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(yellowFix && redFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatio = totalProportion - redRatio;
        redRatioSlider.value(redRatio);
        yellowRatioSlider.value(yellowRatio);
    }
    if(redFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        redRatioSlider.value(redRatio);
    }
    if(blueFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatioSlider.value(blueRatio);
    }
    if(yellowFix){
        yellowRatio = Math.floor(totalProportion/(activatedSliders-1));
        yellowRatioSlider.value(yellowRatio);
    }
    reset();
}

function adjustYellowProportion() {
    let totalProportion = 100;
    if(!redFix){
        totalProportion -= redRatio;
    }
    if(!blueFix){
        totalProportion -= blueRatio;
    }
    if(!greenFix){
        totalProportion -= yellowRatio;
    }
    if(yellowRatio > totalProportion){
        yellowRatio = totalProportion;
        yellowRatioSlider.value(yellowRatio);
    }
    totalProportion -= yellowRatio;

    if(redFix && blueFix && greenFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatio = totalProportion - redRatio - blueRatio;
        redRatioSlider.value(redRatio);
        blueRatioSlider.value(blueRatio);
        greenRatioSlider.value(greenRatio);
    }
    if(redFix && blueFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatio = totalProportion - redRatio;
        redRatioSlider.value(redRatio);
        blueRatioSlider.value(blueRatio);
    }
    if(greenFix && blueFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatio = totalProportion - blueRatio;
        blueRatioSlider.value(blueRatio);
        greenRatioSlider.value(greenRatio);
    }
    if(greenFix && redFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatio = totalProportion - redRatio;
        redRatioSlider.value(redRatio);
        greenRatioSlider.value(greenRatio);
    }
    if(redFix){
        redRatio = Math.floor(totalProportion/(activatedSliders-1));
        redRatioSlider.value(redRatio);
    }
    if(blueFix){
        blueRatio = Math.floor(totalProportion/(activatedSliders-1));
        blueRatioSlider.value(blueRatio);
    }
    if(greenFix){
        greenRatio = Math.floor(totalProportion/(activatedSliders-1));
        greenRatioSlider.value(greenRatio);
    }
    reset();
}

function adjustRed() {
    if(redFix && activatedSliders > 2){
        redButton.html("Unfix");
        redRatioSlider.attribute("disabled", "disabled");
        activatedSliders -= 1;
        redFix = !redFix;
    }
    else if(!redFix){
        redButton.html("Fix");
        redRatioSlider.removeAttribute("disabled");
        activatedSliders += 1;
        redFix = !redFix;
    }
}

function adjustBlue() {
    if(blueFix && activatedSliders > 2){
        blueButton.html("Unfix");
        blueRatioSlider.attribute("disabled", "disabled");
        activatedSliders -= 1;
        blueFix = !blueFix;
    }
    else if(!blueFix){
        blueButton.html("Fix");
        blueRatioSlider.removeAttribute("disabled");
        activatedSliders += 1;
        blueFix = !blueFix;
    }
}

function adjustGreen() {
    if(greenFix && activatedSliders > 2){
        greenButton.html("Unfix");
        greenRatioSlider.attribute("disabled", "disabled");
        activatedSliders -= 1;
        greenFix = !greenFix;
    }
    else if(!greenFix){
        greenButton.html("Fix");
        greenRatioSlider.removeAttribute("disabled");
        activatedSliders += 1;
        greenFix = !greenFix;
    }
}

function adjustYellow() {
    if(yellowFix && activatedSliders > 2){
        yellowButton.html("Unfix");
        yellowRatioSlider.attribute("disabled", "disabled");
        activatedSliders -= 1;
        yellowFix = !yellowFix;
    }
    else if(!yellowFix){
        yellowButton.html("Fix");
        yellowRatioSlider.removeAttribute("disabled");
        activatedSliders += 1;
        yellowFix = !yellowFix;
    }
}

function iterate(){
    if(satisfiedPercent >= 100){
        stepButton.attribute("disabled", "disabled");
        stopSimulation();
        startButton.attribute("disabled", "disabled");
        return;
    }
    let totalSatisfied = 0;
    let unsatisfied = [];
    let emptyHouses = [];
    globalIteration += 1;

    for(let rect in allRects){
        if(allRects[rect].color == 0){
            emptyHouses.push(rect)
        }
    }

    rectSize = (canvasSize-50)/size;

    for(let rect in allRects){
        let house = allRects[rect];
        let coord = int(rect) + 1;
        let myColor = house.color;
        if(myColor != 0){
            let neighbors = [];
            if(coord % size != 1){
                neighbors.push(coord - 1)
            }
            if(coord % size != 0){
                neighbors.push(coord + 1)
            }
            if(coord > size){
                neighbors.push(coord-size)
            }
            if(coord + size <= size*size){
                neighbors.push(coord+size)
            }
            if(coord % size != 1 && coord > size){
                neighbors.push(coord-size-1)
            }
            if(coord % size != 0 && coord > size){
                neighbors.push(coord-size+1)
            }
            if(coord % size != 1 && coord + size <= size*size){
                neighbors.push(coord+size-1)
            }
            if(coord % size != 0 && coord + size <= size*size){
                neighbors.push(coord+size+1)
            }
            
            let similarNeighbors = 0;
            let neighborCount = neighbors.length;

            for(let neighbor in neighbors){
                neighbor = neighbors[neighbor] - 1;
                if(allRects[neighbor].color == myColor){
                    similarNeighbors += 1;
                }
                else if(allRects[neighbor].color == 0){
                    neighborCount -= 1
                }
            }

            let mySatisfaction;

            if(neighborCount == 0){
                mySatisfaction = 1;
            }
            else {
                mySatisfaction = similarNeighbors/neighborCount;
            }

            if(mySatisfaction >= similarity/100){
                totalSatisfied += 1;
            }
            else{
                unsatisfied.push(rect)
            }
        }
    }

    for(let house in unsatisfied){
        house = unsatisfied[house]
        let oldColor = allRects[house].color;
        let newHouse;
        emptyHouses, newHouse = getRandomElement(emptyHouses);
        emptyHouses.push(house);
    
        if(oldColor == 1){
            allRects[newHouse].rect.style.backgroundColor = "red";
        }
        else if(oldColor == 2){
            allRects[newHouse].rect.style.backgroundColor = "blue";
        }
        else if(oldColor == 3){
            allRects[newHouse].rect.style.backgroundColor = "green";
        }
        else if(oldColor == 4){
            allRects[newHouse].rect.style.backgroundColor = "yellow";
        }
        allRects[newHouse].color = oldColor;

        allRects[house].rect.style.backgroundColor = "white";
        allRects[house].color = 0;
    }

    round.innerHTML = "Round: " + str(globalIteration);
    satisfiedPercent = (totalSatisfied/(allRects.length-emptyHouses.length))*100;
    satisfied.innerHTML = "Satisfied: " + str(Math.floor(satisfiedPercent * 10) / 10)  + "%";
    if(satisfiedPercent >= 100){
        stopSimulation();
        startButton.attribute("disabled", "disabled");
        stepButton.attribute("disabled", "disabled");
        stopButton.attribute("disabled", "disabled");
        return;
    }
}

function draw() {
    updateSimilarity();
    updateRatio();
    updateEmpty();
    updateSize();
    updateDelay();
}

function reset() {
    clearInterval(globalInterval);
    stopButton.attribute("disabled", "disabled");
    startButton.removeAttribute("disabled");
    stepButton.removeAttribute("disabled");
    globalIteration = 0;
    round.innerHTML = "Round: " + str(globalIteration);
    satisfiedPercent = 0;
    satisfied.innerHTML = "Satisfied: " + str(Math.floor(satisfiedPercent * 10) / 10)  + "%";
    getRandomColors();
    rectSize = (canvasSize-50)/size;
    populateGrid();
}

function startSimulation(){
    globalInterval = setInterval(iterate, delay);
    startButton.attribute("disabled", "disabled");
    stopButton.removeAttribute("disabled");
    stepButton.attribute("disabled", "disabled");
}

function stopSimulation(){
    clearInterval(globalInterval);
    stopButton.attribute("disabled", "disabled");
    startButton.removeAttribute("disabled");
    stepButton.removeAttribute("disabled");
}

function stepSimulation(){
    if(satisfiedPercent < 100){
        iterate();
    }
    else{
        stepButton.removeAttribute("disabled")
    }
}

function updateSimilarity(){
    similarity = similarSlider.value();
    similarText.innerHTML = "Similarity: " + str(similarity) + "%";
}

function updateRatio(){
    redRatio = redRatioSlider.value();
    blueRatio = blueRatioSlider.value();
    greenRatio = greenRatioSlider.value();
    yellowRatio = yellowRatioSlider.value();
    redRatioText.innerHTML = "Red Proportion: " + str(redRatio) + "%";
    blueRatioText.innerHTML = "Blue Proportion: " + str(blueRatio) + "%";
    greenRatioText.innerHTML = "Green Proportion: " + str(greenRatio) + "%";
    yellowRatioText.innerHTML = "Yellow Proportion: " + str(yellowRatio) + "%";
}

function updateEmpty(){
    empty = emptySlider.value();
    emptyText.innerHTML = "Empty: " + str(empty) + "%";
}

function updateSize(){
    size = sizeSlider.value();
    sizeText.innerHTML = "Size: " + str(size) + "x" + str(size);
}

function updateDelay(){
    delay = delaySlider.value();
    delayText.innerHTML = "Delay: " + str(delay) + " ms";
}

function getRandomColors(){
    let totalHouses = size*size;
    let numEmpty = Math.floor(empty/100 * totalHouses);
    let allEmptyHouses = Array(numEmpty).fill(0);
    totalHouses -= numEmpty;

    let numRed = Math.floor(redRatio/100 * totalHouses);
    let allRedHouses = Array(numRed).fill(1);

    let numBlue = Math.floor(blueRatio/100 * totalHouses);
    let allBlueHouses = Array(numBlue).fill(2);

    let numGreen = Math.floor(greenRatio/100 * totalHouses);
    let allGreenHouses = Array(numGreen).fill(3);

    let numYellow = Math.floor(yellowRatio/100 * totalHouses);
    let allYellowHouses = Array(numYellow).fill(4);

    totalHouses = totalHouses - numRed - numGreen - numBlue - numGreen;
    if(totalHouses > 0){
        allEmptyHouses.concat(Array(totalHouses).fill(0));
    }

    randomColors = allEmptyHouses.concat(allRedHouses).concat(allBlueHouses).concat(allGreenHouses).concat(allYellowHouses);
}

function populateGrid() {
    let myRectColor;
    const tbl = document.getElementById('main');
    tbl.innerHTML = '';
    tbl.style.width = '600px';
    tbl.style.border = '0px';
    tbl.style.borderCollapse = 'collapse';
    globalIteration = 0;
    allRects = [];

    for(let i = 0; i < size; i++){
        let tr = tbl.insertRow();
        for(let j = 0; j < size; j++){
            let td = tr.insertCell();
            randomColors, myRectColor = getRandomElement(randomColors);

            tr.style.width = `${rectSize}px`;
            tr.style.height = `${rectSize}px`;
            if(myRectColor == 1){
                td.style.backgroundColor = "red";
            }
            else if(myRectColor == 2){
                td.style.backgroundColor = "blue";
            }
            else if(myRectColor == 3){
                td.style.backgroundColor = "green";
            }
            else if(myRectColor == 4){
                td.style.backgroundColor = "yellow";
            }
            else{
                td.style.backgroundColor = "white";
            }
            td.style.border = '1px solid black';
            let house = new House(td, myRectColor, i, j);
            allRects.push(house)
        }
    }
}