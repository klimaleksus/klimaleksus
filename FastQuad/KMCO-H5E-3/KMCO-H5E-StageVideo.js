// KMCO-H5E-StageVideo.js

"use strict";

(function KMCO_H5E_StageVideo(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var RADIUS = 20;

var BulletTest = (function BulletTest(BulletTest){
  var Drawable = Inherit.Parent('Drawable');
  var Strokable = Inherit.Parent('Strokable');
  var Sprite = Inherit.Parent('Sprite');
  //var Button = Inherit.Parent('Button');
  //var GamePlayer = Global.GamePlayer;
  var S = Private('$Sprite.S$');
  return StageVideo = Inherit([Drawable,Strokable],{
    x$: 0,
    y$: 0,
    r$: RADIUS,
    vx$: 0,
    vy$: 0,
    [S]: null,
    dead$: false,
    $new: function(canvas){
      Drawable.$new.call(this,canvas);
      Strokable.$new.call(this,canvas,null);
      if(!this[S])
        this[S] = Sprite.new(canvas);
    },
    $delete: function(){
      Drawable.$delete.call(this);
      Strokable.$delete.call(this);
      if(this[S])
        this[S] = this[S].delete();
    },
    init: function(img){
      this.line = 4;
      this.stroke.hsl(1/6,0.8,0.4);
      this.fill.hsl(0/6,0.9,0.5);
      this[S].setimage(img);
      return this;
    },
    draw: function(){
      if(this.dead)
        return this;
      //Strokable.draw.call(this);
      //var canvas = this.canvas;
      //canvas.draw_circle(this.x,this.y,this.r);
      this[S].x = this.x-this.r;
      this[S].y = this.y-this.r;
      this[S].draw();
      return this;
    },
    step: function(){
      if(this.dead)
        return this;
      this.x += this.vx;
      this.y += this.vy;
      var canvas = this.canvas;
      if(this.x-this.r<0 || this.y-this.r<0 || this.x+this.r>canvas.width || this.y+this.r>canvas.height){
        this.dead = true;
      }
      return this;
    },
  },'BulletTest');

})();//BulletTest


var StageVideo = (function StageVideo(StageVideo){
  var Drawable = Inherit.Parent('Drawable');
  var Timer = Inherit.Parent('Timer');
  return StageVideo = Inherit([Drawable],{
    array$: null,
    timer$: null,
    dir$: 0,
    len$: 0,
    $new: function(canvas){
      Drawable.$new.call(this,canvas);
      if(!this.timer)
        this.timer = Timer.new();
      this.array = [];
    },
    $delete: function(){
      Drawable.$delete.call(this);
      if(this.timer)
        this.timer = this.timer.delete();
      if(this.array)
        this.clear();
    },
    clear: function(){
      for(var i=0,a=this.array,n=a.length; i<n; i++)
        a[i].delete();
      this.array.length = 0;
    },
    init: function(){
      this.clear();
      this.dir = 0;
      this.len = 0;
      var canvas = this.canvas;
      var timer = this.timer;
      var img = document.getElementById('sprite_ball');
      img = canvas.scale_image(img,RADIUS*2,RADIUS*2);
      var me = this;
      //console.log(img);
      timer.start('ball',3,function(){
        //console.log('*');
        timer.reset('ball');
        var v = BulletTest.new(canvas);
        v.init(img);
        v.x = canvas.width/2;
        v.y = canvas.height/2;
        var d = me.dir;
        var m = (2+Math.cos(me.len)+Math.sin(me.len));
        me.dir += 0.1+Math.sin(me.len)/15+Math.pow(Math.cos(-me.dir),2)/4;
        me.len += 0.15+Math.sin(me.dir)/10;
        v.vx = Math.cos(d)*m;
        v.vy = Math.sin(d)*m;
        me.array.push(v);
      });
      return this;
    },
    draw: function(){
      var a = this.array;
      var n = a.length;
      for(var i=0; i<n; i++){
        var v = a[i];
        v.draw();
      }
      return this;
    },
    step: function(){
      this.timer.tick();
      var a = this.array;
      var n = a.length;
      var m = n;
      for(var i=0,j=0; i<n; i++){
        var v = a[i];
        a[j] = v;
        v.step();
        if(v.dead){
          v.delete();
          m--;
        }else
          j++;
      }
      if(m<n)
        a.length = m;
      return this;
    },
    click: function(x,y,b){
      return false;
    },
  },'StageVideo');
})();//StageVideo

Global.StageVideo = StageVideo; 

})();//KMCO_H5E_StageVideo

//EOF