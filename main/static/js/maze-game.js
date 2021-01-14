/**
 * By Noble H. Mushtak
 * In Public Domain
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
function updateScore(e){score=e,scoreElem.textContent="Score: "+Math.round(score),score>highScore&&(highScore=score,highScoreElem.textContent="High Score: "+Math.round(highScore))}function startGame(){scoreDecrementer=setInterval(function(){timePassed++,timePassedElem.textContent="Time Passed: "+timePassed,updateScore(score-2/3)},1e3),gameStarted=!0,pauseButton.textContent="PAUSE GAME"}function pauseGame(){clearInterval(scoreDecrementer),gameStarted=!1,pauseButton.textContent="GAME PAUSED"}function inGrid(e){return grid.hasOwnProperty(e.x)&&grid[e.x].hasOwnProperty(e.y)}function pointsDist(e,t){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)}function applyDir(e,t){return{x:e.x+directions[t].x,y:e.y+directions[t].y}}function appendRect(e){var t=defaultRect.cloneNode();t.setAttribute("x",20*e.x/8+"%"),t.setAttribute("y",(20*e.y+40)/4+"%"),e.x==userLoc.x&&e.y==userLoc.y?t.setAttribute("fill","black"):whiteMoves==nextYellow?(t.setAttribute("fill","yellow"),yellowBlocks++,whiteMoves=0,nextYellow=Math.floor(maxWhiteMoves*Math.random())+1):whiteMoves++,svg.appendChild(t),svgGrid[e.x][e.y]=t}function clearGrid(){whiteMoves=0,nextYellow=Math.floor(maxWhiteMoves*Math.random())+1;for(var e=0;e<svg.childNodes.length;e++)svg.childNodes[e].tagName&&"RECT"===svg.childNodes[e].tagName.toUpperCase()&&(svg.removeChild(svg.childNodes[e]),e--);yellowBlocks=0,grid=[],svgGrid=[];for(var e=0;40>e;e++){grid.push([]),svgGrid.push([]);for(var t=0;18>t;t++)grid[e].push(!1),svgGrid[e].push(null)}}function fillMap(e){function t(t){for(var o=0;4>o;o++){var s=applyDir(e,o);t(s)&&n.push(s)}}clearGrid();for(var o=Object.create(e),s=[!1,!1,!1,!1];;){if(grid[e.x][e.y]||(grid[e.x][e.y]=!0,appendRect(e)),e.x||(s[0]=!0,o=Object.create(e)),e.y||(s[1]=!0,o=Object.create(e)),39===e.x&&(s[2]=!0,o=Object.create(e)),17===e.y&&(s[3]=!0,o=Object.create(e)),s.every(function(e){return e}))return;var n=[];t(function(t){return inGrid(t)&&!grid[t.x][t.y]&&pointsDist(t,o)>pointsDist(e,o)}),n.length||t(inGrid),e=n[Math.floor(n.length*Math.random())]}}function moveUser(e){gameStarted||startGame();var t=applyDir(userLoc,e);inGrid(t)?grid[t.x][t.y]&&("yellow"===svgGrid[t.x][t.y].getAttribute("fill")&&(updateScore(score+1),yellowBlocks--,blocksCollected++,blocksCollectedElem.textContent="Blocks Collected: "+blocksCollected),svgGrid[userLoc.x][userLoc.y].setAttribute("fill","white"),svgGrid[t.x][t.y].setAttribute("fill","black"),userLoc=t):(updateScore(score-yellowBlocks/4),blocksMissed+=yellowBlocks,blocksMissedElem.textContent="Blocks Missed: "+blocksMissed,0==e?t.x=39:1==e?t.y=17:2==e?t.x=0:3==e&&(t.y=0),userLoc=t,fillMap(userLoc))}function adjustSize(){function e(e){return n.left+(.5*o-parseInt(getComputedStyle(e).width))/2}var t=getComputedStyle(svg),o=parseInt(t.width),s=o/2;svg.style.height=s+"px";var n=gameContainer.getBoundingClientRect();buttons.UP.style.left=e(buttons.UP)+"px",buttons.UP.style.top=n.top+window.pageYOffset+.1*s+"px",buttons.DOWN.style.left=e(buttons.DOWN)+"px",buttons.DOWN.style.top=n.top+window.pageYOffset+.5*s+"px",pauseButton.style.left=e(pauseButton)+"px",pauseButton.style.top=n.top+window.pageYOffset+.8*s+"px";var r=parseInt(getComputedStyle(buttons.LEFT).width),l=parseInt(getComputedStyle(buttons.RIGHT).width),i=r+l+5,d=(.5*o-i)/2;buttons.LEFT.style.left=n.left+d+"px",buttons.LEFT.style.top=n.top+window.pageYOffset+.3*s+"px",buttons.RIGHT.style.left=n.left+d+i-l+"px",buttons.RIGHT.style.top=n.top+window.pageYOffset+.3*s+"px",blocksCollectedElem.style.left=e(blocksCollectedElem)+1.5*o+"px",blocksCollectedElem.style.top=n.top+window.pageYOffset+.15*s+"px",blocksMissedElem.style.left=e(blocksMissedElem)+1.5*o+"px",blocksMissedElem.style.top=n.top+window.pageYOffset+.45*s+"px",timePassedElem.style.left=e(timePassedElem)+1.5*o+"px",timePassedElem.style.top=n.top+window.pageYOffset+.75*s+"px",scoreElem.setAttribute("font-size",.0875*s),highScoreElem.setAttribute("font-size",.0875*s)}var svg=document.getElementById("svg"),SVG="http://www.w3.org/2000/svg",defaultRect=document.createElementNS(SVG,"rect");defaultRect.setAttribute("width","2.5%"),defaultRect.setAttribute("height","5%"),defaultRect.setAttribute("fill","white"),defaultRect.setAttribute("stroke","#1B3");var buttons={UP:document.getElementById("up"),RIGHT:document.getElementById("right"),DOWN:document.getElementById("down"),LEFT:document.getElementById("left")},pauseButton=document.getElementById("pause"),blocksCollected=0,blocksMissed=0,timePassed=0,blocksCollectedElem=document.getElementById("blocks-collected"),blocksMissedElem=document.getElementById("blocks-missed"),timePassedElem=document.getElementById("time-passed"),userLoc={x:0,y:8},score=0,highScore=0,scoreElem=document.getElementById("score"),highScoreElem=document.getElementById("highscore"),gameStarted=!1,scoreDecrementer,grid=[],svgGrid=[],yellowBlocks,directions=[{x:-1,y:0},{x:0,y:-1},{x:1,y:0},{x:0,y:1}],dirsMap={LEFT:0,UP:1,RIGHT:2,DOWN:3},maxWhiteMoves=8,whiteMoves,nextYellow;fillMap(userLoc);var gameContainer=document.getElementById("game-container");gameContainer.addEventListener(mouseevents.click,gameContainer.focus),gameContainer.addEventListener("keydown",function(e){e.keyCode>=37&&e.keyCode<=40&&(e.preventDefault(),moveUser(e.keyCode-37)),16==e.keyCode&&pauseGame()}),gameContainer.addEventListener(mouseevents.mousedown,function(e){e.preventDefault()}),gameContainer.addEventListener(mouseevents.mouseup,function(e){e.preventDefault()}),pauseButton.addEventListener(mouseevents.mousedown,pauseGame);for(var k in buttons)!function(e){function t(){n?moveUser(dirsMap[e]):clearInterval(s)}function o(e){n=!1,e.currentTarget.removeEventListener(mouseevents.mouseup,o)}var s,n=!1;buttons[e].addEventListener(mouseevents.mousedown,function(e){n=!0,t(),setTimeout(function(){n&&(s=setInterval(t,50))},250),document.body.addEventListener(mouseevents.mouseup,o)})}(k);document.addEventListener("DOMContentLoaded",adjustSize),window.addEventListener("resize",adjustSize);