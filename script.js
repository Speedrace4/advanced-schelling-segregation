let similarSlider;
let similarity;
let similarText;

let ratioSlider;
let ratio;
let ratioText;

let emptySlider;
let empty;
let emptyText;

let sizeSlider;
let size;
let sizeText;

let delaySlider;
let delay;
let delayText;


let startButton;
let stopButton;
let resetButton;
let stepButton;
let addButton;
let subtractButton;

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

    let overallDiv = document.getElementById("ultimateDiv");

    let buttonDiv = createDiv();
    buttonDiv.id("button");
    buttonDiv.parent(overallDiv);

    let sliderDiv = createDiv();
    sliderDiv.id("slider");
    sliderDiv.parent(overallDiv);

    let similarDiv = createDiv();
    similarDiv.id("similarDiv");
    similarDiv.parent("slider");
    similarSlider = createSlider(0, 100, 30, 1);
    similarity = similarSlider.value();
    similarText = document.createElement('div');
    similarText.innerHTML = "Similarity: " + str(similarity) + "%";
    document.getElementById('similarDiv').appendChild(similarText);
    similarSlider.parent("similarDiv")

    let ratioDiv = createDiv();
    ratioDiv.id("ratioDiv");
    ratioDiv.parent("slider");
    ratioSlider = createSlider(0, 100, 50, 1);
    ratioSlider.mouseReleased(reset);
    ratio = ratioSlider.value();
    ratioText = document.createElement('div');
    ratioText.innerHTML = "Ratio: " + str(ratio) + "/" + str(100-ratio) + "%";
    document.getElementById('ratioDiv').appendChild(ratioText);
    ratioSlider.parent("ratioDiv")

    let emptyDiv = createDiv();
    emptyDiv.id("emptyDiv");
    emptyDiv.parent("slider");
    emptySlider = createSlider(0, 100, 10, 1);
    emptySlider.mouseReleased(reset);
    empty = emptySlider.value();
    emptyText = document.createElement('div');
    emptyText.innerHTML = "Empty: " + str(empty) + "%";
    document.getElementById('emptyDiv').appendChild(emptyText);
    emptySlider.parent("emptyDiv")

    let sizeDiv = createDiv();
    sizeDiv.id("sizeDiv");
    sizeDiv.parent("slider");
    sizeSlider = createSlider(10, 80, 50, 1);
    sizeSlider.mouseReleased(reset);
    size = sizeSlider.value();
    sizeText = document.createElement('div');
    sizeText.innerHTML = "Size: " + str(size) + "x" + str(size);
    document.getElementById('sizeDiv').appendChild(sizeText);
    sizeSlider.parent("sizeDiv")

    let delayDiv = createDiv();
    delayDiv.id("delayDiv");
    delayDiv.parent("slider");
    delaySlider = createSlider(1, 3000, 100, 1);
    delay = delaySlider.value();
    delayText = document.createElement('div');
    delayText.innerHTML = "Delay: " + str(delay) + " ms";
    document.getElementById('delayDiv').appendChild(delayText);
    delaySlider.parent("delayDiv")

    startButton = createButton('Start');
    startButton.mousePressed(startSimulation);
    stopButton = createButton('Stop');
    stopButton.mousePressed(stopSimulation);
    resetButton = createButton('Reset');
    resetButton.mousePressed(reset);
    stepButton = createButton('Step');
    stepButton.mousePressed(stepSimulation);
    addButton = createButton('Add Color');
    addButton.mousePressed(addRace);
    subtractButton = createButton('Remove Color');
    subtractButton.mousePressed(subtractRace);

    startButton.parent("button");
    stopButton.parent("button");
    stopButton.attribute("disabled", "disabled");
    resetButton.parent("button");
    stepButton.parent("button");
    addButton.parent("button");
    subtractButton.parent("button");
    subtractButton.attribute("disabled", "disabled");
    reset();
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

function addRace(){
    if(totalRaces == 3){
        addButton.attribute("disabled", "disabled");
    }
    totalRaces += 1;
}

function subtractRace(){
    similarity = similarSlider.value();
}

function updateSimilarity(){
    similarity = similarSlider.value();
    similarText.innerHTML = "Similarity: " + str(similarity) + "%";
}

function updateRatio(){
    ratio = ratioSlider.value();
    ratioText.innerHTML = "Ratio: " + str(ratio) + "/" + str(100-ratio) + "%";
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
    let numRed = Math.floor(ratio/100 * totalHouses);
    let allRedHouses = Array(numRed).fill(1);
    totalHouses -= numRed;
    let numBlue = totalHouses;
    let allBlueHouses = Array(numBlue).fill(2);
    randomColors = allEmptyHouses.concat(allRedHouses).concat(allBlueHouses);
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
            else{
                td.style.backgroundColor = "white";
            }
            td.style.border = '1px solid black';
            let house = new House(td, myRectColor, i, j);
            allRects.push(house)
        }
    }
}