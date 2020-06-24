// KMCO-H5E-StageTest.js

"use strict";

(function KMCO_H5E_StageTest(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var StageTest = (function StageTest(StageTest){
  var Drawable = Inherit.Parent('Drawable');
  var Button = Inherit.Parent('Button');
  var GamePlayer = Global.GamePlayer;
  var P1 = Private('$StageTest.P1$');
  var P2 = Private('$StageTest.P2$');
  var B1 = Private('$StageTest.B1$');
  return StageTest = Inherit([Drawable],{
    [P1]: null,
    [P2]: null,
    [B1]: null,
    $new: function(canvas){
      Drawable.$new.call(this,canvas);
      if(!this[P1])
        this[P1] = GamePlayer();
      if(!this[P2])
        this[P2] = GamePlayer();
      if(!this[B1])
        this[B1] = Button.new(canvas);
    },
    $delete: function(){
      Drawable.$delete.call(this);
      if(this[P1])
        this[P1] = null;
      if(this[P2])
        this[P2] = null;
      if(this[B1])
        this[B1] = null;
    },
    copy: function(stagetest){
      //this[P1].copy(stagetest[P1]);
      //this[P2].copy(stagetest[P2]);
      this[B1].copy(stagetest[B1]);
      return Drawable.copy.call(this,stagetest);
    },
    init: function(){
      this[P1].init(false);
      this[P2].init(true);
      var b1 = this[B1];
      var canvas = this.canvas;
      b1.rect(canvas.width*2/3,canvas.height*2/3,canvas.width/8,canvas.height/8,5);
      b1.line = 2;
      b1.stroke.gray(0.8);
      b1.fill.graya(1,0.2);
      return this;
    },
    draw: function(){
      this[P1].draw();
      this[P2].draw();
      this[B1].draw();
      return this;
    },
    step: function(){
      this[P1].step();
      this[P2].step();
      return this;
    },
    click: function(x,y,b){
      if(this[B1].click(x,y,b)){
        GamePlayer.toggle = !GamePlayer.toggle;
        return true;
      }
      return false;
    },
  },'StageTest');
})();//StageTest

Global.StageTest = StageTest; 

})();//KMCO_H5E_StageTest

//EOF