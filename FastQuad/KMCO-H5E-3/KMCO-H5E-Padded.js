// KMCO-H5E-Padded.js

"use strict";

(function KMCO_H5E_Padded(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Padded = (function Padded(Padded){
  var Dirty = Inherit.Parent('Dirty');
  var PX = Private('$Padded.PX$');
  var PY = Private('$Padded.PY$');
  var FX = Private('$Padded.FX$');
  var FY = Private('$Padded.FY$');
  return Padded = Inherit(Dirty,{
    [PX]: 0,
    [PY]: 0,
    [FX]: 0,
    [FY]: 0,
    $new: function(delegate){
      Dirty.$new.call(this,delegate);
    },
    $delete: function(){
      Dirty.$delete.call(this);
    },
    copy: function(padded){
      this[PX] = padded[PX];
      this[PY] = padded[PY];
      this[FX] = padded[FX];
      this[FY] = padded[FY];
      return Dirty.copy.call(this,padded);
    },
    pad_x$get: function(){
      return this[PX];
    },
    pad_x$set: function(v){
      if(v===this[PX])
        return;
      this[PX] = v;
      this.dirty_();
    },
    pad_y$get: function(){
      return this[PY];
    },
    pad_y$set: function(v){
      if(v===this[PY])
        return;
      this[PY] = v;
      this.dirty_();
    },
    fix_x$get: function(){
      return this[FX];
    },
    fix_x$set: function(v){
      if(v===this[FX])
        return;
      this[FX] = v;
      this.dirty_();
    },
    fix_y$get: function(){
      return this[FY];
    },
    fix_y$set: function(v){
      if(v===this[FY])
        return;
      this[FY] = v;
      this.dirty_();
    },
    pad: function(pad_x,pad_y){
      if(this[PX]===pad_x && this[PY]==pad_y)
        return this;
      this[PX] = pad_x;
      this[PY] = pad_y;
      return this.dirty_();
    },
    fix: function(fix_x,fix_y){
      if(this[FX]===fix_x && this[FY]==fix_y)
        return this;
      this[FX] = fix_x;
      this[FY] = fix_y;
      return this.dirty_();
    },
  },'Padded');
})();//Padded

Global.Padded = Padded; 

})();//KMCO_H5E_Padded

//EOF