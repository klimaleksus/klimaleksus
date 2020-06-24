// KMCO-H5E-Timer.js

"use strict";

(function KMCO_H5E_Timer(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Timer = (function Timer(Timer){
  var Base = Inherit.Base;
  var M = Private('$Timer.M$');
  return Timer = Inherit(Base,{
    [M]: null,
    $new: function(){
      Base.$new.call(this);
      if(!this[M])
        this[M] = Object.create(null);
    },
    $delete: function(){
      Base.$delete.call(this);
      var map = this[M];
      if(this[M]){
        for(var name in map)
          map[name] = map[name].F = null;
        this[M] = null;
      }
    },
    copy: function(timer){
      var map = this[M];
      for(var name in map)
        map[name] = map[name].F = null;
      this[M] = map = Object.create(null);
      var tgt = timer[M];
      for(var name in tgt){
        var obj = tgt[name];
        map[name] = {
          T: obj.T,
          F: obj.F,
          R: obj.R,
        };
      }
      return Base.copy.call(this,timer);
    },
    start: function(name,time,ontick){
      var obj = this[M][name];
      if(!obj)
        this[M][name] = {
          T: time,
          F: ontick,
          R: time,
        };
      else{
        obj.T = time;
        obj.F = ontick;
        obj.R = time;
      }
      return this;
    },
    tick: function(){
      var map = this[M];
      for(var name in map)
        if(!(--map[name].T))
          map[name].F();
      return this;
    },
    get: function(name){
      var obj = this[M][name];
      if(!obj)
        throw new Error('Timer.get(name): unknown name!');
      return obj.T;
    },
    set: function(name,time){
      var obj = this[M][name];
      if(!obj)
        throw new Error('Timer.set(name,time): unknown name!');
      obj.T = time;        
      return this;
    },
    reset: function(name){
      var obj = this[M][name];
      if(!obj)
        throw new Error('Timer.reset(name): unknown name!');
      obj.T = obj.R;        
      return this;
    },
  },'Timer');
})();//Timer

Global.Timer = Timer; 

})();//KMCO_H5E_Timer

//EOF