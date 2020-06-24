// KMCO-H5E-Sprite.js

"use strict";

(function KMCO_H5E_Sprite(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Sprite = (function Sprite(Sprite){
  var Drawable = Inherit.Parent('Drawable');
  var I = Private('$Sprite.I$');
  return Sprite = Inherit(Drawable,{
    x$: 0,
    y$: 0,
    [I]: null,
    $new: function(canvas){
      Drawable.$new.call(this,canvas);
    },
    $delete: function(){
      Drawable.$delete.call(this);
      this[I] = null;
    },
    setimage: function(img){
      this[I] = img;
    },
    copy: function(sprite){
      this[I] = sprite[I];
      return Drawable.copy.call(this,sprite);
    },
    draw: function(){
      this.canvas.draw_image(this.x,this.y,this[I]);
      return this;
    },
  },'Sprite');
})();//Sprite

Global.Sprite = Sprite;

})();//KMCO_H5E_Sprite

//EOF