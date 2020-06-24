// KMCO-H5E-Strokable.js

"use strict";

(function KMCO_H5E_Strokable(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Strokable = (function Strokable(Strokable){
  var F = Private('$Strokable.F$');
  var S = Private('$Strokable.S$');
  var L = Private('$Strokable.L$');
  //var A = Private('$Strokable.A$');
  var Color = Inherit.Parent('Color');
  var Dirty = Inherit.Parent('Dirty');
  var Drawable = Inherit.Parent('Drawable');
  return Strokable = Inherit([Drawable,Dirty],{
    [F]: null,
    [S]: null,
    [L]: 0,
    //[A]: 1,
    $new: function(canvas,delegate){
      Drawable.$new.call(this,canvas);
      Dirty.$new.call(this,delegate);
      if(!this[F])
        this[F] = Color.new(this,delegate).own(this);
      if(!this[S])
        this[S] = Color.new(this,delegate).own(this);
    },
    $delete: function(){
      if(this[F])
        this[F] = this[F].delete();
      if(this[S])
        this[S] = this[S].delete();
      Drawable.$delete.call(this);
      Dirty.$delete.call(this);
    },
    copy: function(strokable){
      this[F].copy(strokable[F]);
      this[S].copy(strokable[S]);
      this[L] = strokable[L];
      //this[A] = strokable[A];
      Drawable.copy.call(this,strokable);
      return Dirty.copy.call(this,strokable);
    },
    stroke$get: function(){
      return this[S];
    },
    fill$get: function(){
      return this[F];
    },
    line$get: function(){
      return this[L];
    },
    line$set: function(v){
      if(v===this[L])
        return;
      this[L] = v;
      this.dirty_();
    },
    /*alpha$get: function(){
      return this[A];
    },
    alpha$set: function(v){
      if(v===this[A])
        return;
      this[A] = v;
      this.dirty_();
    },*/
    draw: function(){
      //var canvas = this.canvas;
      //canvas.draw_alpha(this[A]);
      if(this[L])
        this.canvas.draw_color(this[S].css,this[F].css,this[L]);
      else
        this.canvas.draw_color('',this[F].css);
      return this;
    },
  },'Strokable');
})();//Strokable

Global.Strokable = Strokable;

})();//KMCO_H5E_Strokable

//EOF