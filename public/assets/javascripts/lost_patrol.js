var width = 1000;//window.innerWidth;
var height = 800;//window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'lostpatrol', { preload: preload, create: create});

//horizontal tile shaped level
var levelData=
[[-1,-1,-1,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,0,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,0,0,0,0,0,0,0,0,0,0,0,-1],
[0,0,0,0,0,0,0,0,0,0,0,0,-1],
[0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,-1],
[-1,0,0,0,0,0,0,0,0,0,0,0,-1],
[-1,0,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,-1,0,0,0,0,0,0,0,-1,-1,-1]];

var hexTileHeight=52;
var hexTileWidth=61;
var hexGrid;

// Hexagonal Minesweeper
// Credit for creating the hex tiles goes to Juwal Bose
//https://gamedevelopment.tutsplus.com/tutorials/creating-hexagonal-minesweeper--cms-28655

// Disable middle mouse click compass
// Accepted Answer From
// https://stackoverflow.com/questions/5136845/prevent-middle-mouse-click-scrolling

$(function() {
    $('body').mousedown(function(e){if(e.button==1)return false});
});

function preload() {
    //load all necessary assets
    game.load.image('save_button', './assets/javascripts/save_button_scaled.png');
    game.load.atlasJSONHash('hexes_final', './assets/javascripts/hexes_final.png',
     './assets/javascripts/hexes_final.json');
}

function create() {
    game.stage.backgroundColor = '#FFFFFF';
    levelData=transpose(levelData);//transpose for having the right shape
    createLevel();
    //game.input.addMoveCallback(findHexTile, this);
    game.input.mousePointer.leftButton.onDown.add(onLeftDown);
    game.input.mousePointer.middleButton.onDown.add(onMiddleDown);
    game.input.mousePointer.rightButton.onDown.add(onRightDown);
    
    // Maintain aspect ratio
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


    // Prevent right click menu
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
}

function createLevel(){
    hexGrid=game.add.group();
   
    var verticalOffset=hexTileHeight;
    var horizontalOffset=hexTileWidth*3/4;
    var startX;
    var startY;
    var startXInit=hexTileWidth/2;
    var startYInit=hexTileHeight/2;

    //hexGrid.scale=new Phaser.Point(0.4,0.4);
    var hexTile;
    for (var i = 0; i < levelData.length; i++)
    {
        startX=startXInit;
        startY=2*startYInit+(i*verticalOffset);
        for (var j = 0; j < levelData[0].length; j++)
        {
            if(j%2!=0){
                startY=startY+startYInit;
            }else{
                startY=startY-startYInit;
            }
            if(levelData[i][j]!=-1){
                hexTile= new HexTile(game, startX, startY, 'hexes_final', 'over_growth/Over_Growth_Scaled.png',i,j,levelData[i][j]);
                hexGrid.add(hexTile);
            }
            startX+=horizontalOffset;
        }
         
    }
    hexGrid.x=150;
    hexGrid.y=0;

}

function checkForOccuppancy(i,j){
    var tileType=levelData[i][j];
    if(tileType==-1 || tileType==10){
        return true;
    }
    return false;
}

function checkforBoundary(i,j){//check if the tile is outside level data array
    if(i<0 || j<0 || i >levelData.length-1 || j>levelData[0].length-1){
        return true;
    }
    return false;
}

// On left mouse button down, switch tile
function onLeftDown(){
    var tile= findHexTile();
    console.log(tile.x +"_"+ tile.y);

    if(!checkforBoundary(tile.x,tile.y)) {
        if(checkForOccuppancy(tile.x,tile.y)) {
            if(levelData[tile.x][tile.y]==10) {
                var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
                if(!hexTile.revealed){
                    hexTile.switchTile();
                }
            }
        }   
        else {
            var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
            hexTile.switchTile();
        }
    }
}

// On middle mouse button down, revert to previous tile
function onMiddleDown() {
    var tile= findHexTile();

    if(!checkforBoundary(tile.x,tile.y)) {
        if(checkForOccuppancy(tile.x,tile.y)) {
            if(levelData[tile.x][tile.y]==10) {
                var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
                if(!hexTile.revealed){
                    hexTile.revertTile();
                }
            }
        }   
        else {
            var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
            hexTile.revertTile();
        }
    }
}

// On right mouse button down, rotate tile
function onRightDown() {
    var tile = findHexTile();

    if (!checkforBoundary(tile.x, tile.y)) {
        if (checkForOccuppancy(tile.x, tile.y)) {
            if (levelData[tile.x][tile.y] == 10) {
                var hexTile = hexGrid.getByName("tile"+tile.x+"_"+tile.y);
                if (!hexTile.revealed) {
                    hexTile.rotateTile();
                }
            }
        }
        else {
            var hexTile = hexGrid.getByName("tile"+tile.x+"_"+tile.y);
            hexTile.rotateTile();
        }
    }
}

function findHexTile(){
    var pos=game.input.activePointer.position;
    pos.x-=hexGrid.x;
    pos.y-=hexGrid.y;
    var xVal = Math.floor((pos.x)/(hexTileWidth*3/4));
    var yVal = Math.floor((pos.y)/(hexTileHeight));

    pos.x=yVal;
    pos.y=xVal;
    return pos;
}

function recursiveReveal(i,j){
    var newPt=new Phaser.Point(i,j);
    var hexTile;
    var tempArray=[newPt];
    var neighbors;
    while (tempArray.length){
        newPt=tempArray[0];
        var neighbors=getNeighbors(newPt.x,newPt.y);
        
        while(neighbors.length){
            newPt=neighbors.shift();
            hexTile=hexGrid.getByName("tile"+newPt.x+"_"+newPt.y);
            if(!hexTile.revealed){
                //hexTile.reveal();
                if(levelData[newPt.x][newPt.y]==0){
                    tempArray.push(newPt);
                }
            }
        }
        newPt=tempArray.shift();
        hexTile=hexGrid.getByName("tile"+newPt.x+"_"+newPt.y);
    }
}

function transpose(a) {
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
        );
}