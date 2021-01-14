//The SVG Element:
var svg = document.getElementById("svg");
//The SVG Namespace:
var SVG = "http://www.w3.org/2000/svg";
//The default 20x20 rect:
var defaultRect = document.createElementNS(SVG, "rect");
defaultRect.setAttribute("width", (20/8)+"%");
defaultRect.setAttribute("height", (20/4)+"%");
defaultRect.setAttribute("fill", "white");
defaultRect.setAttribute("stroke", "#1B3");

//The arrow buttons:
var buttons = {
    UP: document.getElementById("up"),
    RIGHT: document.getElementById("right"),
    DOWN: document.getElementById("down"),
    LEFT: document.getElementById("left")
};
//The pause button:
var pauseButton = document.getElementById("pause");
//The statistics:
var blocksCollected = 0, blocksMissed = 0, timePassed = 0;
//The statistics elements:
var blocksCollectedElem = document.getElementById("blocks-collected");
var blocksMissedElem = document.getElementById("blocks-missed");
var timePassedElem = document.getElementById("time-passed");

//(Note that points must be in {x: [0, 39], y: [0, 17]})
//The user's current location:
var userLoc = {x: 0, y: 8};
//The user's score and the user's high score:
var score = 0, highScore = 0;
//The element telling the user their score and high score;
var scoreElem = document.getElementById("score"), highScoreElem = document.getElementById("highscore");
//This bool is true iff the user has moved and they haven't paused.
var gameStarted = false;
//This is returned by the score decrementer:
var scoreDecrementer;

function updateScore(scoreParam) {
    /* This function updates the score to scoreParam. */
    //Set score:
    score = scoreParam;
    //Tell the user their score:
    scoreElem.textContent = "Score: "+Math.round(score);
    //Update the high score:
    if (score > highScore) highScore = score, highScoreElem.textContent = "High Score: "+Math.round(highScore);
}
function startGame() {
    /* This function starts the game by setting a counter that decrements the user's score by 2/3 every second. */
    scoreDecrementer = setInterval(function() {
        //Update the time passed:
        timePassed++, timePassedElem.textContent = "Time Passed: "+timePassed;
        //Decrement the score:
        updateScore(score-2/3);
    }, 1000);
    //Set gameStarted to true:
    gameStarted = true;
    //Change pauseButton:
    pauseButton.textContent = "PAUSE GAME"
}
function pauseGame() {
    /* This function pauses the game and stops decrementing the score. */
    clearInterval(scoreDecrementer);
    //Set gameStarted to false:
    gameStarted = false;
    //Change pauseButton:
    pauseButton.textContent = "GAME PAUSED";
}

//The grid (false represents obstacle, true represents path):
var grid = [];
//The grid of SVG rects:
var svgGrid = [];
//The number of yellow blocks on the board:
var yellowBlocks;
function inGrid(test) {
    /* This function tests if a point is valid: */
    return grid.hasOwnProperty(test.x) && grid[test.x].hasOwnProperty(test.y);
}

function pointsDist(point1, point2) {
    /* This returns the distance of point1 and point2: */
    return Math.abs(point1.x-point2.x)+Math.abs(point1.y-point2.y);
}

//The different directions of left (0), up (1), right (2), and down (3):
var directions = [
    {x: -1, y: 0}, //LEFT
    {x: 0, y: -1}, //UP
    {x: 1, y: 0}, //RIGHT
    {x: 0, y: 1} //DOWn
];
//Directions associated with words:
var dirsMap = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
};
function applyDir(point, dir) {
    /* This funciton applies the direction dir to point: */
    return {
        x: point.x+directions[dir].x,
        y: point.y+directions[dir].y
    };
}

//This is the maximum number of white blocks that can be put down before we need a new yellow block:
var maxWhiteMoves = 8;
//This is the number of white blocks we've put down since the last yellow block:
var whiteMoves;
//This is the number of white blocks we should put down before our next yellow block:
var nextYellow;
function appendRect(point) {
    /* This function creates a rectangle given a point: */
    //Clone defaultRect:
    var rect = defaultRect.cloneNode();
    //Set the rectangle's location:
    rect.setAttribute("x", (20*point.x/8)+"%");
    rect.setAttribute("y", ((20*point.y+40)/4)+"%");
    //If the point is userLoc, make it black:
    if (point.x == userLoc.x && point.y == userLoc.y) rect.setAttribute("fill", "black");
    //Otherwise, if whiteMoves is nextYellow, make it yellow and increment yellowBlocks.
    else if (whiteMoves == nextYellow) {
        rect.setAttribute("fill", "yellow"), yellowBlocks++;
        //Also, set whiteMoves to 0 and set nextYellow to a random integer in [1, maxWhiteMoves].
        whiteMoves = 0, nextYellow = Math.floor(maxWhiteMoves*Math.random())+1;
    }
    //Otherwise, increment whtieMoves:
    else whiteMoves++;
    //Append it into the game:
    svg.appendChild(rect);
    //Make sure to put it into svgGrid:
    svgGrid[point.x][point.y] = rect;
}

function clearGrid() {
    /* This function clears the grid. */
    //Set whiteMoves to 0 and nextYellow to a random integer in [1, maxWhiteMoves].
    whiteMoves = 0, nextYellow = Math.floor(maxWhiteMoves*Math.random())+1;
    //This clears svg of any rectangles:
    for (var i = 0; i < svg.childNodes.length; i++) if (svg.childNodes[i].tagName && svg.childNodes[i].tagName.toUpperCase() === "RECT") svg.removeChild(svg.childNodes[i]), i--;
    //There are no more yellow blocks:
    yellowBlocks = 0;
    //Initialize grid and svgGrid to empty arrays:
    grid = [], svgGrid = [];
    //Initialize the grid to all false and svgGrid to all null:
    for (var i = 0; i < 40; i++) {
        grid.push([]), svgGrid.push([]);
        for (var j = 0; j < 18; j++) grid[i].push(false), svgGrid[i].push(null);
    }
}

function fillMap(loc) {
    /* This flood fills the game with a path. */
    //Clear the grid:
    clearGrid();
    
    //A marker for where we don't want to be:
    var marker = Object.create(loc);
    //These are the edges we've reached so far:
    var edgesFilled = [
        false, //!loc.x
        false, //!loc.y
        false, //loc.x == 39
        false //loc.y == 17
    ];
    
    //While we haven't reached all of them...
    while (true) {
        //This function fills svg with a bunch of rectangles to make a path out of the maze, starting at loc:
        //If we haven't already added this point:
        if (!grid[loc.x][loc.y]) {
            //Make grid at loc true:
            grid[loc.x][loc.y] = true;
            //Add loc to svg:
            appendRect(loc);
        }
        
        //Update the edges we've reached
        if (!loc.x) edgesFilled[0] = true, marker = Object.create(loc);
        if (!loc.y) edgesFilled[1] = true, marker = Object.create(loc);
        if (loc.x === 39) edgesFilled[2] = true, marker = Object.create(loc);
        if (loc.y === 17) edgesFilled[3] = true, marker = Object.create(loc);
        //Return if we've reached all the edges:
        if (edgesFilled.every(function(reachedEdge) { return reachedEdge; })) return;

        //All valid next points:
        var dirs = [];
        function setDirs(valid) {
            /* This function set dirs with points that are next to loc andvalid according to valid: */   
            for (var i = 0; i < 4; i++) {
                var curPoint = applyDir(loc, i);
                if (valid(curPoint)) dirs.push(curPoint);
            }
        }
        //Include all new points in the grid that are farther away from where we started than the last marker:
        setDirs(function(curPoint) { return inGrid(curPoint) && !grid[curPoint.x][curPoint.y] && pointsDist(curPoint, marker) > pointsDist(loc, marker); });
        //Include all points in the grid if there are still no valid points:
        if (!dirs.length) setDirs(inGrid);

        //Pick a random point (if there exists a valid point) and continue:
        loc = dirs[Math.floor(dirs.length*Math.random())];
    }
}
//Flood fill starting from the user's position:
fillMap(userLoc);

//This is the container of everything in the game, including the game itself, but also the buttons and statistics.
var gameContainer = document.getElementById("game-container");

//When someone clicks on the game, focus on it.
gameContainer.addEventListener(mouseevents.click, gameContainer.focus);

function moveUser(dir) {
    /* This function moves the user in the direction of dir. */
    //If the game hasn't started, start the game:
    if (!gameStarted) startGame();
    //This is the point that following the direction of dir.
    var nextPoint = applyDir(userLoc, dir);
    //If this point is in our path, move to there:
    if (inGrid(nextPoint)) {
        if (grid[nextPoint.x][nextPoint.y]) {
            //If nextPoint is yellow, increment score and tell the user. Also, decrement yellowBlocks and update the blocks collected.
            if (svgGrid[nextPoint.x][nextPoint.y].getAttribute("fill") === "yellow") {
                updateScore(score+1), yellowBlocks--;
                blocksCollected++, blocksCollectedElem.textContent = "Blocks Collected: "+blocksCollected;
            }
            //Change the black rect to the one at nextPoint:
            svgGrid[userLoc.x][userLoc.y].setAttribute("fill", "white");
            svgGrid[nextPoint.x][nextPoint.y].setAttribute("fill", "black");
            //Set userLoc:
            userLoc = nextPoint;
        }
    }
    //Otherwise, if it's off the grid, move the user to a new grid:
    else {
        //Decrement the score by the number of yellow blocks still on the screen divided by 4 and tell the user:
        updateScore(score-yellowBlocks/4);
        //Also, update the blocks missed:
        blocksMissed += yellowBlocks, blocksMissedElem.textContent = "Blocks Missed: "+blocksMissed;
        //Move the user to the opposite edge:
        if (dir == 0) nextPoint.x = 39;
        else if (dir == 1) nextPoint.y = 17;
        else if (dir == 2) nextPoint.x = 0;
        else if (dir == 3) nextPoint.y = 0;
        //Set userLoc:
        userLoc = nextPoint;
        //Fill the grid:
        fillMap(userLoc);
    }
}

//When someone presses a key while focused on the game...
gameContainer.addEventListener("keydown", function(event) {
    //If it's an arrow key:
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        //Don't scroll!
        event.preventDefault();
        //Move the user according to the arrow clicked:
        moveUser(event.keyCode-37);
    }
    //If it's the Shift key, pause the game.
    if (event.keyCode == 16) pauseGame();
});
//Stop zooming in and highlighting text when the game is pressed on mobile devices:
gameContainer.addEventListener(mouseevents.mousedown, function(event) {
    event.preventDefault();
});
//Stop zooming in when the game is clicked on mobile devices:
gameContainer.addEventListener(mouseevents.mouseup, function(event) {
    event.preventDefault();
});
//Pause the game when the pause button is pressed:
pauseButton.addEventListener(mouseevents.mousedown, pauseGame);

//When someone presses an arrow button, move accordingly:
for (var k in buttons) {
    //Put this in a function wrapper to remember the value of k, timeoutReturn, intervalReturn, and moving.
    (function(k) {
        var intervalReturn, moving = false;
        function moveUserDir() {
            /* This moves the user in the direction we want: */
            //Make sure that the button hasn't been released:
            if (moving) moveUser(dirsMap[k]);
            //If it has, stop moving:
            else clearInterval(intervalReturn);
        }
        function stopMoving(event) {
            /* This event handler sets moving to false and removes stopMoving as an event handler: */
            moving = false;
            event.currentTarget.removeEventListener(mouseevents.mouseup, stopMoving);
        }
        
        //When a button is pressed...
        buttons[k].addEventListener(mouseevents.mousedown, function(event) {
            //Set moving to true:
            moving = true;
            //Move the user:
            moveUserDir();
            //After 250 milliseconds of holding down the button, start moving twenty times a second:
            setTimeout(function() {
                //Make sure the button hasn't been released:
                if (moving) intervalReturn = setInterval(moveUserDir, 50);
            }, 250);
            
            //If the mouse is released _anywhere_, call stopMoving:
            document.body.addEventListener(mouseevents.mouseup, stopMoving);
        });
    })(k);
}

function adjustSize() {
    /* This function adjusts the size and location of everything. */
    //Get the svg's styles:
    var svgStyles = getComputedStyle(svg);
    //Get svg's width
    var gameWidth = parseInt(svgStyles.width);
    //Set height to double the width
    var gameHeight = gameWidth/2;
    svg.style.height = gameHeight+"px";
    //Get the location of the game container.
    var pastLoc = gameContainer.getBoundingClientRect();
    function centerElemWidth(elem) {
        /* This function returns the .left property of the button elem that will make elem centered horizontally on the left. */
        return pastLoc.left+(0.5*gameWidth-parseInt(getComputedStyle(elem).width))/2;
    }

    //Set the positions of the buttons:
    buttons.UP.style.left = centerElemWidth(buttons.UP)+"px";
    buttons.UP.style.top = pastLoc.top+window.pageYOffset+0.1*gameHeight+"px";
    buttons.DOWN.style.left = centerElemWidth(buttons.DOWN)+"px";
    buttons.DOWN.style.top = pastLoc.top+window.pageYOffset+0.5*gameHeight+"px";
    pauseButton.style.left = centerElemWidth(pauseButton)+"px";
    pauseButton.style.top = pastLoc.top+window.pageYOffset+0.8*gameHeight+"px";   
    //To position the LEFT and RIGHT buttons, first calculate the amount of space needed on each side to make them look centered:
    var leftWidth = parseInt(getComputedStyle(buttons.LEFT).width), rightWidth = parseInt(getComputedStyle(buttons.RIGHT).width);
    var sumWidth = leftWidth+rightWidth+5;
    var spaceNeeded = (0.5*gameWidth-sumWidth)/2;
    //Then, position accordingly:
    buttons.LEFT.style.left = pastLoc.left+spaceNeeded+"px";
    buttons.LEFT.style.top = pastLoc.top+window.pageYOffset+0.3*gameHeight+"px";
    buttons.RIGHT.style.left = pastLoc.left+spaceNeeded+sumWidth-rightWidth+"px";
    buttons.RIGHT.style.top = pastLoc.top+window.pageYOffset+0.3*gameHeight+"px";

    //Also, position the statistics by centering them on the right:
    blocksCollectedElem.style.left = (centerElemWidth(blocksCollectedElem)+1.5*gameWidth)+"px";
    blocksCollectedElem.style.top = pastLoc.top+window.pageYOffset+0.15*gameHeight+"px";
    blocksMissedElem.style.left = (centerElemWidth(blocksMissedElem)+1.5*gameWidth)+"px";
    blocksMissedElem.style.top = pastLoc.top+window.pageYOffset+0.45*gameHeight+"px";
    timePassedElem.style.left = (centerElemWidth(timePassedElem)+1.5*gameWidth)+"px";
    timePassedElem.style.top = pastLoc.top+window.pageYOffset+0.75*gameHeight+"px";

    //Make the text 8.75% of the height:
    scoreElem.setAttribute("font-size", 0.0875*gameHeight);
    highScoreElem.setAttribute("font-size", 0.0875*gameHeight);
}
//Call adjustSize when the document loads and bind it to the resize event.
document.addEventListener("DOMContentLoaded", adjustSize);
window.addEventListener("resize", adjustSize);
