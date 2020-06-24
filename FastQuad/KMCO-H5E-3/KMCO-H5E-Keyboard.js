// KMCO-H5E-Keyboard.js v1.0

"use strict";

(function KMCO_H5E_Keyboard(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

var Keyboard = (function Keyboard(Keyboard){
  var length = 512*8;
  var frame = [];
  var keys = [];
  //var oldpoll = null;
  frame.length = length;
  keys.length = length;
  Keyboard = {
    capture: capture,
    release: release,
    clear: clear,
    poll: poll,
    pressed: pressed,
    event2key: event2key,
    keys: keys,
    last: 0,
    reset: reset,
  };
  clear();
  function clear(){
    for(var i=0; i<length; i++){
      keys[i] = -1;
      //frame[i] = -2;
      frame[i] = 0;
    }
    Keyboard.last = 0;
  };
  function event2key(e){
    return (e.keyCode||0)|((e.location||0)<<7);
  };
  function pressed(key,delay,repeat){
    var v = keys[key];
    if(v===0||v===1||!(v -= delay|0))
      return true;
    if(!(repeat = repeat|0) || v<0 || v%repeat)
      return false;
    return true;
  };
  function poll(akey){
    //oldpoll = akey;
    if(!akey)
      return;
    for(var i=0,n=akey.length; i<n; i++){
      var key = akey[i];
      var val = keys[key];
      var fr = frame[key];
      
      /*
      if(fr>0){
        if(val<0)
          keys[key] = 1;
        else
          keys[key] = val+1;
        frame[key] = 2;
      }else if(fr===-2){
        if(val>0)
          keys[key] = -1;
        else
          keys[key] = val-1;
        //frame[key] = -2;
      }else{
        keys[key] = 0;
        frame[key] = -2;
      }
      */
      if(fr<=0){
        if(val>0)
          keys[key] = -1;
        else
          keys[key] = val-1;
        if(fr)
          frame[key] = 0;
      }else{
        if(fr>1){
          if(fr===2){
            keys[key] = 0;
            frame[key] = 0;
          }else
            keys[key] = val-1;
        }else{
          if(val<0)
            keys[key] = 1;
          else
            keys[key] = val+1;
        }
      }
    }
  };
  function keydown(e){
    var key = event2key(e);
    if(frame[key]<=0){
      frame[key] = frame[key] ? 2 : 1;
      Keyboard.last = key;
    }
    e.preventDefault();
    return false;
  };
  function keyup(e){
    var key = event2key(e);
    frame[key] = -1;
    e.preventDefault();
    return false;
  };
  /*
  function keydown(e){
    var key = event2key(e);
    if(frame[key]&&frame[key]!==2){
      frame[key] = (frame[key]===-2) ? 2 : 1;
      Keyboard.last = key;
    }
    e.preventDefault();
    return false;
  };
  function keyup(e){
    var key = event2key(e);
    console.log(key,frame[key],keys[key]);
    frame[key] = (frame[key]===2||!frame[key]) ? -2 : -1;
    e.preventDefault();
    return false;
  };
  */
  function keypress(e){
    e.preventDefault();
    return false;
  };
  var active = false;
  function capture(){
    if(active)
      return;
    //poll(oldpoll);
    active = true;
    window.addEventListener('keydown',keydown,{passive:false,capture:true});
    window.addEventListener('keyup',keyup,{passive:false,capture:true});
    window.addEventListener('keypress',keypress,{passive:false,capture:true});
    clear();
  };
  function release(){
    if(!active)
      return;
    active = false;
    window.removeEventListener('keydown',keydown,{passive:false,capture:true});
    window.removeEventListener('keyup',keyup,{passive:false,capture:true});
    window.removeEventListener('keypress',keypress,{passive:false,capture:true});
  };
  function reset(){
    for(var i=0; i<length; i++){
      if(keys[i]>=0){
        frame[i] = 3;
        keys[i] = -1;
      }
    }
  };
  Object.preventExtensions(Keyboard);
  return Keyboard;
})();//Keyboard

Global.Keyboard = Keyboard; 

})();//KMCO_H5E_Keyboard

//EOF