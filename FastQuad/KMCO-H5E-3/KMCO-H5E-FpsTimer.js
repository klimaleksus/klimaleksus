// KMCO-H5E-FpsTimer.js

"use strict";

(function KMCO_H5E_FpsTimer(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

function fps_caller_create(fps,calls){
  var msc = 1000.0 / fps;
  return {
    _msc: msc,
    _time: pref_now()-msc,
    _calls: calls,
    _have: 0,
  };
};

function fps_caller_tick(obj){
  if(!obj)
    return false;
  if(obj._have)
    return !!(--obj._have);
  var now = pref_now();
  var msc = obj._msc;
  var have = (now-obj._time)/msc|0;
  if(have){
    if(!obj._calls){
      obj._time = now;
      return true;
    }else if(obj._calls<0)
      have = 1;
    else if(have>obj._calls)
      have = obj._calls;
    obj._time += msc*have;
    obj._have = have;
    return true;
  }
  return false;
};


var FpsTimer = (function FpsTimer(FpsTimer){
  var Base = Inherit.Base;
  var F = Private('$FpsTimer.F$');
  var M = Private('$FpsTimer.M$');
  var T = Private('$FpsTimer.T$');
  var C = Private('$FpsTimer.C$');
  var H = Private('$FpsTimer.H$');
  var L = Private('$FpsTimer.L$');
  return FpsTimer = Inherit(Base,{
    [F]: 0,
    [M]: 0,
    [T]: 0,
    [C]: 0,
    [H]: 0,
    [L]: 0,
    $new: function(){
      Base.$new.call(this);
      //if(!this[A])
      //  this[A] = [];
    },
    $delete: function(){
      //this[A] = null;
      Base.$delete.call(this);
    },
    copy: function(fpstimer){
      this[F] = fpstimer[F];
      this[M] = fpstimer[M];
      this[T] = fpstimer[T];
      this[C] = fpstimer[C];
      this[H] = fpstimer[H];
      this[L] = fpstimer[L];
      return Base.copy.call(this,fpstimer);
    },
    set: function(fps,calls){
      this[F] = fps;
      this[M] = 1000.0/fps;
      this[C] = calls;
      this[T] = performance.now()-this[M];
      this[H] = 0;
      this[L] = 0;
      return this;
    },
    reset: function(){
      this[T] = performance.now()-this[M];
      this[H] = 0;
      this[L] = 0;
      return this;
    },
    until: function(){
      if(this[H]){
        if(--this[H])
          return true;
        return false;
      }
      var now = performance.now();
      var msc = this[M];
      if(!msc)
        return false;
      var have = (now-this[T])/msc|0;
      var call = this[C];
      if(have){
        if(!call){
          this[T] = now;
          return true;//?
        }else if(call>0 && have>call){
          this[L]++;
          have = call;
        }
        this[T] += msc*have;
        this[H] = call<0 ? 1 : have;
        return true;
      }
      this[L] = 0;
      return false;
    },
    lag$get: function(){
      return this[L];
    },
    fps$get: function(){
      return this[F];
    },
    fps$set: function(v){
      if(v>0){
        this[F] = v;
        this[M] = 1000.0/v
      }else
        this[F] = this[M] = 0;
    },
    calls$get: function(){
      return this[C];
    },
    calls$set: function(v){
      this[C] = v;
    },
  },'FpsTimer');
})();//FpsTimer

Global.FpsTimer = FpsTimer;

})();//KMCO_H5E_FpsTimer

//EOF