// KMCO-H5E-Drawable.js

"use strict";

(function KMCO_H5E_Drawable(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Drawable = (function Drawable(Drawable){
  var Base = Inherit.Base;
  var C = Private('$Drawable.C$');
  return Drawable = Inherit(Base,{
    [C]: null,
    $new: function(canvas){
      Base.$new.call(this);
      if(canvas)
        this[C] = canvas;
      else
        throw new Error('Drawable.new(canvas)');
    },
    $delete: function(){
      this[C] = null;
      Base.$delete.call(this);
    },
    copy: function(drawable){
      this[C] = drawable[C];
      return this;
    },
    draw: function(){
      return this;
    },
    canvas$get: function(){
      return this[C];
    },
  },'Drawable');
})();//Drawable

Global.Drawable = Drawable;

})();//KMCO_H5E_Drawable

//EOF