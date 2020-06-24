// KMCO-H5E-GamePlayer.js

"use strict";

(function KMCO_H5E_GamePlayer(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];


var Keyboard = Global.Keyboard;
var Mouse = Global.Mouse;
var Textbox = Global.Textbox;
//var GameEngine = Global.GameEngine;

  function key_pair(main,back){
    return main>0 && main>back;
  };
  
var GamePlayer = function GamePlayer(Player){
  
  GamePlayer.toggle = false;

  var oldmenu = false;
  var old_x = 0;
  var old_y = 0;

  Player = {
    init: function(mouse){
      this.x = 320;
      this.y = 240;
      this.r = 32;
      this.move_x = 0;
      this.move_y = 0;  
      this.move_ax = 0;
      this.move_ay = 0;
      this.mouse = !!mouse;
    },
    draw: function(){
      var toggle = GamePlayer.toggle;
      var canvas = GameEngine.canvas;
      canvas.draw_color('#eee',toggle?'#aaa':'',10);
      canvas.draw_circle(this.x,this.y,this.r);
      if(this.mouse){
        canvas.draw_color('#eee',toggle?'#aaa':'');
        canvas.draw_circle(this.x+this.move_ax,this.y+this.move_ay,this.r/3);
      }else{
        canvas.draw_color('#eee',toggle?'#aaa':'');
        canvas.draw_circle(this.x+this.move_ax,this.y+this.move_ay,this.r/2);
        canvas.draw_color('#eee','');
        canvas.draw_circle(this.x+this.move_x*50,this.y+this.move_y*50,this.r/2);
      }
      canvas.draw_font(50);
      canvas.draw_color('#fff','#999');
      canvas.draw_text(canvas.width/2,0,8,(window.innerWidth|0)+','+(window.innerHeight|0)+'\n'+(window.devicePixelRatio||0).toFixed(2));
      if(this.mouse){
        canvas.draw_text(0,0,7,(this.x|0)+','+(this.y|0));
      }else{
        canvas.draw_text(canvas.width,0,9,(this.x|0)+','+(this.y|0));
      }
    },
    step: function(){
      var canvas = GameEngine.canvas;
      var keys = Keyboard.keys;
      var mouse_x = canvas.map_x(Mouse.x);
      var mouse_y = canvas.map_y(Mouse.y);
      var click = Mouse.keys[1]>0;
      //if(Mouse.key[0]>0)
      //  console.debug(Mouse.key[0]);
      var menu = Mouse.keys[2]>0;
      menu = menu || Mouse.keys[0]>0;
      var up = key_pair(keys[Const.key_up],keys[Const.key_down]);
      var down = key_pair(keys[Const.key_down],keys[Const.key_up]);
      var left = key_pair(keys[Const.key_left],keys[Const.key_right]);
      var right = key_pair(keys[Const.key_right],keys[Const.key_left]);
      var tgt_x = 0;
      var tgt_y = 0;
      var tgt_p = 4;
      var tgt_m = 50;
      if(right)
        tgt_x = 1;
      else if(left)
        tgt_x = -1;
      if(down)
        tgt_y = 1;
      else if(up)
        tgt_y = -1;
      this.move_x += (tgt_x-this.move_x)/tgt_p;
      this.move_y += (tgt_y-this.move_y)/tgt_p;
      if(!this.mouse){
        var a = Math.atan2(this.move_y,this.move_x);
        this.move_ax = this.move_x*Math.abs(Math.cos(a))*tgt_m;
        this.move_ay = this.move_y*Math.abs(Math.sin(a))*tgt_m;
      }else{
        if(menu){
          if(!oldmenu){
            oldmenu = true;
            //old_x = mouse_x;
            //old_y = mouse_y;
            old_x = mouse_x-this.x;
            old_y = mouse_y-this.y;
          }
        }else{
          oldmenu = false;
        }
        if(click || menu){
          var vx,vy;
          if(menu){
            //vx = mouse_x-old_x;
            //vy = mouse_y-old_y;
            vx = mouse_x-old_x-this.x;
            vy = mouse_y-old_y-this.y;
          }else{
            vx = mouse_x-this.x;
            vy = mouse_y-this.y;
          }
          var va = Math.atan2(vy,vx);
          var vdd = vx*vx+vy*vy;
          if(vdd>tgt_m*tgt_m){
            vx = tgt_m*Math.cos(va);
            vy = tgt_m*Math.sin(va);
          }
          this.move_ax += (vx-this.move_ax)/tgt_p;
          this.move_ay += (vy-this.move_ay)/tgt_p;
        }else{
          this.move_ax += (0-this.move_ax)/tgt_p;
          this.move_ay += (0-this.move_ay)/tgt_p;
        }
      }
      this.x += this.move_ax/10;
      this.y += this.move_ay/10;
    },
  };
  return Player;
};//GamePlayer

Global.GamePlayer = GamePlayer; 

})();//KMCO_H5E_GamePlayer

//EOF