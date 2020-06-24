// KMCO-H5E-FpsCount.js

"use strict";

(function KMCO_H5E_FpsCount(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var FpsCount = (function FpsCount(FpsCount){
  var Base = Inherit.Base;
  var C = Private('$FpsCount.C$');
  var F = Private('$FpsCount.F$');
  var A = Private('$FpsCount.A$');
  return FpsCount = Inherit(Base,{
    [C]: 0,
    [F]: 0,
    [A]: null,
    $new: function(){
      Base.$new.call(this);
      if(!this[A])
        this[A] = [];
    },
    $delete: function(){
      this[A] = null;
      Base.$delete.call(this);
    },
    copy: function(fpscount){
      this[A].length = 0;
      var a = this[A], b = fpscount[A], n = b.length;
      this[A].length = n;
      for(var i=0; i<n; i++)
        a[i] = b[i];
      this[C] = fpscount[C];
      this[F] = fpscount[F];
      return Base.copy.call(this,fpscount);
    },
    start: function(average){
      var arr = this[A];
      if((average=average|0)>1 && arr.length!==average){
        arr.length = 0;
        arr.length = average;
      }
      if(arr.length){
        this[C] = 1;
        arr[0] = performance.now();
      }else
        this[C] = 0;
      this[F] = 0;
      return this;
    },
    tick: function(){
      var arr = this[A];
      var len = arr.length;
      if(!len)
        return 0;
      var cur = performance.now();
      if(this[C]<len){
        this[F] = 1000*this[C]/(cur-arr[0]);
        arr[this[C]++] = cur;
      }else{
        this[F] = 1000*len/(cur-arr[this[C]%len]);
        arr[(this[C]++)%len] = cur;
      }
      return this;
    },
    fps$get: function(){
      return this[F];
    },
  },'FpsCount');
})();//FpsCount

Global.FpsCount = FpsCount;

})();//KMCO_H5E_FpsCount

//EOF