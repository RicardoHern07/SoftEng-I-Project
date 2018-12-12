//  Here is a custom game object
HexTile = function (game, x, y, sheet, tileImage, i, j, type) {

    Phaser.Sprite.call(this, game, x, y, sheet, tileImage);
    this.anchor.setTo(0.5, 0.5);
    this.tileTag = game.make.text(0,0,type);
    //this.tileTag = game.make.text(0,0,'i'+(i)+',j'+(j));
    //this.tileTag = game.make.text(0,0,'i'+(i-6)+',j'+(j-6));
        
    this.tileTag.anchor.setTo(0.5, 0.5);
    this.tileTag.addColor('#ffffff',0);
    this.tileTag.rotation=-Math.PI/2;
    this.addChild(this.tileTag);
    this.tileTag.visible=false;
    this.revealed=false;
    this.name="tile"+i+"_"+j;
    this.type=type;

    this.rotation=Math.PI/2;
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    
    this.events.onInputOut.add(this.rollOut, this);
    this.events.onInputOver.add(this.rollOver, this);
    //this.input.onTap.add(switchTile, this);
    //this.events.onInputDown.add(this.switchTile, this);
    this.marked=false;
    
    //this.originali=(i-(Math.floor(j/2)));//x = x' - floor(y/2)
    //this.originalj=j;
};



HexTile.prototype = Object.create(Phaser.Sprite.prototype);
HexTile.prototype.constructor = HexTile;

HexTile.prototype.rollOut=function() {
    this.scale.x = 1;
    this.scale.y = 1;
}
HexTile.prototype.rollOver=function() {
    this.scale.x = 0.9;
    this.scale.y = 0.9;
    console.log(this.name);
}

// On tap
/* List of frames
    dead_end/Dead_End_ScaledX.png
    drop_ship/Drop_Ship_ScaledX.png
    six_way/Six_Way_Scaled.png
    c_long_curve/Clear_Long_Curve_ScaledX.png
    c_sharp_curve/Clear_Sharp_Curve_ScaledX.png
    c_straight/Clear_Straight_ScaledX.png
    c_three_way/Clear_Three_Way_ScaledX.png
    t_long_curve/Tangle_Long_Curve_ScaledX.png
    t_sharp_curve/Tanle_Sharp_Curve_ScaledX.png
    t_straight/Tangle_Staright_ScaledX.png
    t_three_way/Tangle_Three_Way_ScaledX.png
*/



var over_growth = new RegExp('(over_growth*)');
var six_way = new RegExp('(six_way*)');
var c_long_curve = new RegExp('(c_long*)');
var c_sharp_curve = new RegExp('(c_sharp*)');
var c_straight = new RegExp('(c_straight*)');
var c_three_way = new RegExp('(c_three*)');
var t_long_curve = new RegExp('(t_long*)');
var t_sharp_curve = new RegExp('(t_sharp*)');
var t_straight = new RegExp('(t_straight*)');
var t_three_way = new RegExp('(t_three*)'); 
var dead_end = new RegExp('(dead_end*)');
var drop_ship = new RegExp('(drop_ship*)');

var one = new RegExp('(/*d.png)');
var two = new RegExp('(/*2.png)');
var three = new RegExp('(/*3.png)');
var four = new RegExp('(/*4.png)');
var five = new RegExp('(/*5.png)');
var six = new RegExp('(/*6.png)');

/* List of frames
    dead_end/Dead_End_ScaledX.png
    drop_ship/Drop_Ship_ScaledX.png
    six_way/Six_Way_Scaled.png
    c_long_curve/Clear_Long_Curve_ScaledX.png
    c_sharp_curve/Clear_Sharp_Curve_ScaledX.png
    c_straight/Clear_Straight_ScaledX.png
    c_three_way/Clear_Three_Way_ScaledX.png
    t_long_curve/Tangle_Long_Curve_ScaledX.png
    t_sharp_curve/Tanle_Sharp_Curve_ScaledX.png
    t_straight/Tangle_Staright_ScaledX.png
    t_three_way/Tangle_Three_Way_ScaledX.png
*/
HexTile.prototype.switchTile=function() {
    this.tileTag.visible=false;
    this.revealed=false;

    if (this.frameName.match(over_growth)) {
        this.loadTexture('hexes_final', 'six_way/Six_Way_Scaled.png');
    }
    else if (this.frameName.match(six_way)) {
        this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled.png');
    }
    else if (this.frameName.match(c_straight)) {
        this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled.png');
    }
    else if (this.frameName.match(c_long_curve)) {
        this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled.png');
    }
    else if (this.frameName.match(c_sharp_curve)) {
        this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled.png');
    }
    else if (this.frameName.match(c_three_way)) {
        this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled.png');
    }
    else if (this.frameName.match(t_straight)) {
        this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled.png');
    }
    else if (this.frameName.match(t_long_curve)) {
        this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled.png');
    }
    else if (this.frameName.match(t_sharp_curve)) {
        this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled.png');
    }
    else if (this.frameName.match(t_three_way)) {
        this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled.png');
    }
    else if (this.frameName.match(dead_end)) {
        this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled.png');
    }
    else if (this.frameName.match(drop_ship)) {
        this.loadTexture('hexes_final', 'over_growth/Over_Growth_Scaled.png');
    }
}

HexTile.prototype.revertTile=function() {
    this.tileTag.visible=false;
    this.revealed=false;

    if (this.frameName.match(over_growth)) {
        this.loadTexture('hexes_final', 'six_way/Six_Way_Scaled.png');
    }
    else if (this.frameName.match(six_way)) {
        this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled.png');
    }
    else if (this.frameName.match(drop_ship)) {
        this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled.png');
    }
    else if (this.frameName.match(dead_end)) {
        this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled.png');
    }
    else if (this.frameName.match(t_three_way)) {
        this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled.png');
    }
    else if (this.frameName.match(t_sharp_curve)) {
        this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled.png');
    }
    else if (this.frameName.match(t_long_curve)) {
        this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled.png');
    }
    else if (this.frameName.match(t_straight)) {
        this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled.png');
    }
    else if (this.frameName.match(c_three_way)) {
        this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled.png');
    }
    else if (this.frameName.match(c_sharp_curve)) {
        this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled.png');
    }
    else if (this.frameName.match(c_long_curve)) {
        this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled.png');
    }
    else if (this.frameName.match(c_straight)) {
        this.loadTexture('hexes_final', 'over_growth/Over_Growth_Scaled.png');
    }
}

// Don't judge me
HexTile.prototype.rotateTile=function() {

    this.tileTag.visible=false;
    this.revealed=false;

    if (this.frameName.match(six_way) || this.frameName.match(over_growth)) {
        // Do nothing, only one orientation
    }
    else if (this.frameName.match(c_straight)) {
        console.log('rotate');
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 'c_straight/Clear_Straight_Scaled.png');
    }
    else if (this.frameName.match(c_long_curve)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 'c_long_curve/Clear_Long_Curve_Scaled.png');
    }
    else if (this.frameName.match(c_sharp_curve)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 'c_sharp_curve/Clear_Sharp_Curve_Scaled.png');
    }
    else if (this.frameName.match(c_three_way)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 'c_three_way/Clear_Three_Way_Scaled.png');
    }
    else if (this.frameName.match(t_straight)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 't_straight/Tangle_Straight_Scaled.png');
    }
    else if (this.frameName.match(t_long_curve)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 't_long_curve/Tangle_Long_Curve_Scaled.png');
    }
    else if (this.frameName.match(t_sharp_curve)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 't_sharp_curve/Tangle_Sharp_Curve_Scaled.png');
    }
    else if (this.frameName.match(t_three_way)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 't_three_way/Tangle_Three_Way_Scaled.png');
    }
    else if (this.frameName.match(dead_end)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 'dead_end/Dead_End_Scaled.png');
    }
    else if (this.frameName.match(drop_ship)) {
        if (this.frameName.match(one))
            this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled2.png');
        else if (this.frameName.match(two))
            this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled3.png');
        else if (this.frameName.match(three))
            this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled4.png');
        else if (this.frameName.match(four))
            this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled5.png');
        else if (this.frameName.match(five))
            this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled6.png');
        else if (this.frameName.match(six))
            this.loadTexture('hexes_final', 'drop_ship/Drop_Ship_Scaled.png');
    }
}

HexTile.prototype.toggleMark=function() {
    if(this.marked){
       this.marked=false; 
       this.tint='0xffffff';
    }else{
        this.marked=true;
        this.tint='0x0000cc';
    }
}