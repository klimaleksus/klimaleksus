// KMCO-H5E-Rectangle.js

"use strict";

(function KMCO_H5E_Rectangle(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Segment = (function Segment(Segment){
  var Dirty = Inherit.Dirty;
  var X0 = Private('Segment.$X0');
  var X1 = Private('Segment.$X1');
  var W1 = Private('Segment.$W1');
  var W2 = Private('Segment.$W2');
  var TX = Private('Segment.$TX');
  return Segment = Inherit(Dirty,{
    [X0]: 0,
    [X1]: 0,
    [W1]: 0,
    [W2]: 0,
    [TX]: 0,
    $new: function(delegate){
      Dirty.$new.call(this,delegate);
    },
    $delete: function(){
      Dirty.$delete.call(this);
    },
    copy: function(segment){
      this[TX] = segment[TX];
      if(this[TX]>=0){
        this[X1] = segment[X1];
        this[W2] = segment[W2];
      }
      if(this[TX]<=0){
        this[X0] = segment[X0];
        this[W1] = segment[W1];
      }
      return Dirty.copy.call(this,segment);
    },
    x1x2:function(x1,x2){
      this[X1] = x1;
      this[W2] = x2-x1;
      this[TX] = 1;
      this[DR]&&this[DR].call(this);
      return this;
    },
    x1w2:function(x1,w2){
      this[X1] = x1;
      this[W2] = w2;
      this[TX] = 1;
      this[DR]&&this[DR].call(this);
      return this;
    },
    xw:function(x,w){
      this[X0] = x;
      this[W1] = w;
      this[TX] = -1;
      this[DR]&&this[DR].call(this);
      return this;
    },
    x1$get: function(){
      if(this[TX]>=0)
        return this[X1];
      this[TX] = 0;
      var w = this[W1];
      this[W2] = w+w;
      return (this[X1] = this[X0]-w);
    },
    x1$set: function(v){
      if(this[TX]<0)
        this[W2] = this[X0]+this[W1]-v;
      else if(this[X1]===v)
        return;
      else
        this[W2] += this[X1]-v;
      this[TX] = 1;
      this[X1] = v;
      this[DR]&&this[DR].call(this);
    },
    x2$get: function(){
      if(this[TX]>=0)
        return this[X1]+this[W2];
      this[TX] = 0;
      var w = this[W1];
      return (this[X1] = this[X0]-w)+(this[W2] = w+w);
    },
    x2$set: function(v){
      if(this[TX]>=0)
        this[W2] = v-this[X1];
      else
        this[W2] = v-(this[X1] = this[X0]-this[W1]);
      this[TX] = 1;
      this[DR]&&this[DR].call(this);
    },
    x$get: function(){
      if(this[TX]<=0)
        return this[X0];
      this[TX] = 0;
      return (this[X0] = this[X1]+(this[W1] = this[W2]/2));
    },
    x$set: function(v){
      if(this[TX]>0)
        this[W1] = this[W2]/2;
      else if(this[X0]===v)
        return;
      this[TX] = -1;
      this[X0] = v;
      this[DR]&&this[DR].call(this);
    },
    w$get: function(){
      if(this[TX]<=0)
        return this[W1];
      var w = (this[W1] = this[W2]/2);
      this[X0] = this[X1]+w;
      this[TX] = 0;
      return w;
    },
    w$set: function(v){
      if(this[TX]>0)
        this[X0] = this[X1]+this[W2]/2;
      else if(this[W1]===v)
        return;
      this[TX] = -1;
      this[W1] = v;
      this[DR]&&this[DR].call(this);
    },
    w2$get: function(){
      if(this[TX]>=0)
        return this[W2];
      this[TX] = 0;
      var w = this[W1];
      this[X1] = this[X0]-w;
      return (this[W2] = w+w);
    },
    w2$set: function(v){
      if(this[TX]<0)
        this[X1] = this[X0]-this[W1];
      else if(this[W2]===v)
        return;
      this[TX] = 1;
      this[W2] = v;
      this[DR]&&this[DR].call(this);
    },
  },'Segment');
})();

var Rectangle = (function Rectangle(Rectangle){
  var H = Private('Rectangle.$H');
  return Rectangle = Inherit(Segment,{
    $new: function(delegate){
      Segment.$new.call(this,delegate);
      this[H] = Segment.new(this);
    },
    $delete: function(){
      this[H] = this[H].delete();
      Segment.$delete.call(this);
    },
    copy: function(rectangle){
      this[H].copy(rectangle[H]);
      Segment.copy.call(this,rectangle);
    },
    y1y2: function(y1,y2){
      this[H].x1x2(y1,y2);
      return this;
    },
    y1h2: function(y1,h2){
      this[H].x1w2(y1,h2);
      return this;
    },
    ltrd: function(x1,y1,x2,y2){
      return this.x1x2(x1,x2).y1y2(y1,y2);
    },
    xywh: function(x,y,w,h){
      return this.xw(x,w).yh(y,h);
    },
    ltw2: function(x1,y1,w2,h2){
      return this.x1x2(x1,x1+w2).y1y2(y1,y1+h2);
    },    
    yh:function(y,h){
      this[H].xw(y,h);
      return this;
    },
    y1$get: function(){
      return this[H].x1;
    },
    y1$set: function(v){
      this[H].x1 = v;
    },
    y2$get: function(){
      return this[H].x2;
    },
    y2$set: function(v){
      this[H].x2 = v;
    },
    y$get: function(){
      return this[H].x;
    },
    y$set: function(v){
      this[H].x = v;
    },
    h$get: function(){
      return this[H].w;
    },
    h$set: function(v){
      this[H].w = v;
    },
    h2$get: function(){
      return this[H].w2;
    },
    h2$set: function(v){
      this[H].w2 = v;
    },
  },'Rectangle');
})();//Rectangle

Global.Rectangle = Rectangle;
Global.Segment = Segment;

})();//KMCO_H5E_Rectangle

//EOF