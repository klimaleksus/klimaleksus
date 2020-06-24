// KMCO-H5E-Aligned.js

"use strict";

(function KMCO_H5E_Aligned(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Aligned = (function Aligned(Aligned){
  var Dirty = Inherit.Parent('Dirty');
  var X = Private('$Aligned.X$');
  var X1 = Private('$Aligned.X1$');
  var X2 = Private('$Aligned.X2$');
  var Y = Private('$Aligned.Y$');
  var Y1 = Private('$Aligned.Y1$');
  var Y2 = Private('$Aligned.Y2$');
  var RW = Private('$Aligned.RW$');
  var RH = Private('$Aligned.RH$');
  var W = Private('$Aligned.W$');
  var H = Private('$Aligned.H$');
  var CX = Private('$Aligned.CX$');
  var CY = Private('$Aligned.CY$');
  var A = Private('$Aligned.A$');
  return Aligned = Inherit(Dirty,{
    [X]: 0,
    [X1]: 0,
    [X2]: 0,
    [Y]: 0,
    [Y1]: 0,
    [Y2]: 0,
    [RW]: 0,
    [RH]: 0,
    [W]: 0,
    [H]: 0,
    [CX]: 0,
    [CY]: 0,
    [A]: 5,
    $new: function(delegate){
      Dirty.$new.call(this,delegate);
    },
    $delete: function(){
      Dirty.$delete.call(this);
    },
    copy: function(aligned){
      this[X] = aligned[X];
      this[X1] = aligned[X1];
      this[X2] = aligned[X2];
      this[Y] = aligned[Y];
      this[Y1] = aligned[Y1];
      this[Y2] = aligned[Y2];
      this[RW] = aligned[RW];
      this[RH] = aligned[RH];
      this[W] = aligned[W];
      this[H] = aligned[H];
      this[CX] = aligned[CX];
      this[CY] = aligned[CY];
      this[A] = aligned[A];
      return Dirty.copy.call(this,aligned);
    },
    xy: function(x,y,align){
      if(align)
        this.align = align;
      this.x = x;
      this.y = y;
      return this;
    },
    dim: function(width,height){
      this.width = width;
      this.height = height;
      return this;
    },
    wh: function(w,h){
      this.w = w;
      this.h = h;
      return this;
    },
    rect: function(x1,y1,width,height,align){
      return this.dim(width,height).xy(x1,y1,align);
    },
    x1$get: function(){
      return this[X1];
    },
    x2$get: function(){
      return this[X2];
    },
    y1$get: function(){
      return this[Y1];
    },
    y2$get: function(){
      return this[Y2];
    },
    cx$get: function(){
      return this[CX];
    },
    cy$get: function(){
      return this[CY];
    },
    x$get: function(){
      return this[X];
    },
    x$set: function(v){
      v -= this[X];
      if(!v)
        return;
      this[X1] += v;
      this[X2] += v;
      this[CX] += v;
      this[X] = v;
      this.dirty_();
    },
    y$get: function(){
      return this[Y];
    },
    y$set: function(v){
      v -= this[Y];
      if(!v)
        return;
      this[Y1] += v;
      this[Y2] += v;
      this[CY] += v;
      this[Y] += v;
      this.dirty_();
    },
    rw$get: function(){
      return this[RW];
    },
    rw$set: function(v){
      if(v===this[RW])
        return;
      var w = v+v;
      switch(this[A]){
        case 1: case 4: case 7:
          this[X2] = this[X]+w;
          this[CX] = this[X]+v;
          break;
        case 2: case 5: case 8:
          this[X1] = this[X]-v;
          this[X2] = this[X]+v;
          break;
        case 3: case 6: case 9:
          this[X1] = this[X]-w;
          this[CX] = this[X]-v;
          break;
      }
      this[RW] = v;
      this[W] = w;      
      this.dirty_();
    },
    rh$get: function(){
      return this[RH];
    },
    rh$set: function(v){
      if(v===this[RH])
        return;
      var h = v+v;
      switch(this[A]){
        case 7: case 8: case 9:
          this[Y2] = this[Y]+h;
          this[CY] = this[Y]+v;
          break;
        case 4: case 5: case 6:
          this[Y1] = this[Y]-v;
          this[Y2] = this[Y]+v;
          break;
        case 1: case 2: case 3:
          this[Y1] = this[Y]-h;
          this[CY] = this[Y]-v;
          break;
      }
      this[RH] = v;
      this[H] = h;
      this.dirty_();
    },
    width$get: function(){
      return this[W];
    },
    width$set: function(v){
      if(this[W]!==v)
        this.rw = v/2;
    },
    height$get: function(){
      return this[H];
    },
    height$set: function(v){
      if(this[H]!==v)
        this.rh = v/2;
    },
    align$get: function(){
      return this[A];
    },
    align$set: function(v){
      if(v===this[A])
        return;
      switch(v){
        case 1:
          this[X] = this[X1];
          this[Y] = this[Y2];
          break;
        case 2:
          this[X] = this[CX];
          this[Y] = this[Y2];
          break;
        case 3:
          this[X] = this[X2];
          this[Y] = this[Y2];
          break;
        case 4:
          this[X] = this[X1];
          this[Y] = this[CY];
          break;
        case 5:
          this[X] = this[CX];
          this[Y] = this[CY];
          break;
        case 6:
          this[X] = this[X2];
          this[Y] = this[CY];
          break;
        case 7:
          this[X] = this[X1];
          this[Y] = this[Y1];
          break;
        case 8:
          this[X] = this[CX];
          this[Y] = this[Y1];
          break;
        case 9:
          this[X] = this[X2];
          this[Y] = this[Y1];
          break;
        default:
          throw new Error('Aligned.align = "'+v+'"');
      }
      this[A] = v;
      this.dirty_();
    },
    click: function(x,y){
      return x>=this[X1] && x<=this[X2] && y>=this[Y1] && y<=this[Y2];
    },
  },'Aligned');
})();// Aligned

Global.Aligned = Aligned;

})();//KMCO_H5E_Aligned

//EOF