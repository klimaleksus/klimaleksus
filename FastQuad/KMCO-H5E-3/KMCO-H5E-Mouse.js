// KMCO-H5E-Mouse.js v1.0

"use strict";

(function KMCO_H5E_Mouse(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

var Mouse = (function Mouse(Mouse){
  var keys = [];
  var wheels = [];
  Mouse = {
    capture: capture,
    release: release,
    clear: clear,
    poll: poll,
    keys: keys,
    wheels: wheels,
    pressed: pressed,
    x: 0,
    y: 0,
  };
  var elem = null;
  var elem_x, elem_y;
  var state = [];
  var len = 8;
  keys.length = len;
  state.length = len;
  var code2button = [1,3,2,4,5,6,7];
  var clicks = [];
  var usemouse;
  var Mouse;
  var touch_new = Object.create(null);
  var touch_all = Object.create(null);
  var touch_cur = null;
  wheels.length = 3;
  var axes = [];
  axes.length = 3;
  clear();
  var active = false;
  function recalc(){
    if(!elem){
      elem_x = 0;
      elem_y = 0;      
      return;
    }
    var rect = elem.getBoundingClientRect();
    elem_x = rect.left;
    elem_y = rect.top;
  };
  function pressed(key,delay,repeat){
    var v = keys[key];
    if(v===0||v===1||!(v -= delay|0))
      return true;
    if(!(repeat = repeat|0) || v<0 || v%repeat)
      return false;
    return true;
  };
  function proc(event,up){
    if(touch_cur===null){
      Mouse.x = event.clientX-elem_x;
      Mouse.y = event.clientY-elem_y;
    }
    var b = event.buttons;
    if(up)
      for(var i=1,m=1; i<len; i++,m<<=1)
        state[i] = b&m;
    else
      for(var i=1,m=1; i<len; i++,m<<=1)
        if(state[i]>=0)
          state[i] = b&m;
  };
  function resize(e){
    recalc();
  };
  function scroll(e){
    recalc();
  };
  function contextmenu(e){
    e.preventDefault();
    return false;
  };
  function dblclick(e){
    e.preventDefault();
    return false;
  };
  function click(e){
    e.preventDefault();
    return false;
  };
  function mousedown(e){
    proc(e,true);
    var b = code2button[e.button];
    if(b)
      clicks.push([
        e.clientX-elem_x,
        e.clientY-elem_y,
        b]);
    e.preventDefault();
    return false;
  };
  function mousemove(e){
    proc(e,false);
  };
  function mouseup(e){
    proc(e,true);
  };
  function touchstart(e){
    if(e.cancelable)
      e.preventDefault();
    usemouse = false;
    var map = Object.create(null);
    for(var i=0,n=e.touches.length; i<n; i++)
      map[e.touches[i].identifier] = e.touches[i];
    for(var i=0,n=e.changedTouches.length; i<n; i++)
      map[e.changedTouches[i].identifier] = e.changedTouches[i];
    for(var id in map){
      if(!touch_all[id]){
        var ev = map[id];
        var x = ev.clientX-elem_x;
        var y = ev.clientY-elem_y;
        touch_new[id] = clicks.push([x,y,0,id,x,y]);
        touch_all[id] = id;
      }
    }
  };
  function touchend(e){
    if(e.cancelable)
      e.preventDefault();
    var map = Object.create(null);
    for(var i=0,n=e.touches.length; i<n; i++)
      map[e.touches[i].identifier] = true;
    var arr = [];
    for(var id in touch_all){
      if(map[id])
        continue;
      arr.push(id);
    }
    for(var i=0,n=e.changedTouches.length; i<n; i++)
      arr.push(''+e.changedTouches[i].identifier);
    for(var i=0,n=arr.length; i<n; i++){
      var id = arr[i];
      delete touch_all[id];
      var idx = touch_new[id];
      if(idx){
        clicks[idx-1][2] = -1;
        delete touch_new[id];
      }
      if(touch_cur===id){
        state[0] = 0;
        touch_cur = null;
      }
    }
  };
  function touchcancel(e){
    return touchend(e);
  };
  function touchmove(e){
    if(e.cancelable)
      e.preventDefault();
    var arr = [];
    for(var i=0,n=e.touches.length; i<n; i++)
      arr.push(e.touches[i]);
    for(var i=0,n=e.changedTouches.length; i<n; i++)
      arr.push(e.changedTouches[i]);
    for(var i=0,n=arr.length; i<n; i++){
      var ev = arr[i];
      var id = ''+ev.identifier;
      var x = ev.clientX-elem_x;
      var y = ev.clientY-elem_y;
      var idx = touch_new[id];
      if(idx){
        var c = clicks[idx-1];
        c[4] = x;
        c[5] = y;
      }
      if(touch_cur===id){
        Mouse.x = x;
        Mouse.y = y;
      }
    }
  };
  function wheel(e){
    var x,y,z;
    if((y=e.deltaY)>0)
      axes[0]++
    else if(y<0)
      axes[0]--;
    if((x=e.deltaX)>0)
      axes[1]++;
    else if(x<0)
      axes[1]--;
    if((z=e.deltaZ)>0)
      axes[2]++;
    else if(z<0)
      axes[2]--;
    //console.log(x,y,z);
    e.preventDefault();
    return false;
  };
  function clear(){
    if(!elem)
      elem = document.body;
    recalc();
    usemouse = true;
    //Mouse.x = 0;
    //Mouse.y = 0;
    for(var i=0; i<len; i++){
      keys[i] = -1;
      if(state[i]>0)
        state[i] = -1;
      else
        state[i] = 0;
    }
    for(var i=0; i<3; i++){
      wheels[i] = 0;
      axes[i] = 0;
    }
    touch_cur = null;
    clicks.length = 0;
  };
  function capture(element){
    if(element){
      elem = element;
      recalc();
    }
    if(active)
      return;
    clear();
    active = true;
    window.addEventListener('resize',resize,{passive:true,capture:true});
    window.addEventListener('scroll',scroll,{passive:true,capture:true});
    window.addEventListener('contextmenu',contextmenu,{passive:false,capture:true});
    window.addEventListener('dblclick',dblclick,{passive:false,capture:true});
    window.addEventListener('click',click,{passive:false,capture:true});
    window.addEventListener('mousedown',mousedown,{passive:false,capture:true});
    window.addEventListener('mousemove',mousemove,{passive:true,capture:true});
    window.addEventListener('mouseup',mouseup,{passive:true,capture:true});
    window.addEventListener('touchstart',touchstart,{passive:false,capture:true});
    window.addEventListener('touchend',touchend,{passive:false,capture:true});
    window.addEventListener('touchcancel',touchcancel,{passive:false,capture:true});
    window.addEventListener('touchmove',touchmove,{passive:false,capture:true});
    window.addEventListener('wheel',wheel,{passive:false,capture:true});
  };
  function release(){
    if(!active)
      return;
    active = false;
    window.removeEventListener('resize',resize,{passive:true,capture:true});
    window.removeEventListener('scroll',scroll,{passive:true,capture:true});
    window.removeEventListener('contextmenu',contextmenu,{passive:false,capture:true});
    window.removeEventListener('dblclick',dblclick,{passive:false,capture:true});
    window.removeEventListener('click',click,{passive:false,capture:true});
    window.removeEventListener('mousedown',mousedown,{passive:false,capture:true});
    window.removeEventListener('mousemove',mousemove,{passive:true,capture:true});
    window.removeEventListener('mouseup',mouseup,{passive:true,capture:true});
    window.removeEventListener('touchstart',touchstart,{passive:false,capture:true});
    window.removeEventListener('touchend',touchend,{passive:false,capture:true});
    window.removeEventListener('touchcancel',touchcancel,{passive:false,capture:true});
    window.removeEventListener('touchmove',touchmove,{passive:false,capture:true});
    window.removeEventListener('wheel',wheel,{passive:false,capture:true});
  };
  function poll(handle){
    for(var i=0; i<len; i++){
      if(state[i]>0){
        if(keys[i]<0)
          keys[i] = 1;
        else
          keys[i] = keys[i]+1;
      }else{
        if(keys[i]>0)
          keys[i] = -1;
        else
          keys[i] = keys[i]-1;
      }
    }
    for(var i=0; i<3; i++){
      wheels[i] = axes[i];
      axes[i] = 0;
    }
    for(var i=0,n=clicks.length; i<n; i++){
      var click = clicks[i];
      var b = click[2];
      var use = true;
      if(b>0){
        if(usemouse && handle){
          use = handle(click[0],click[1],b);
        }
        if(use){
          keys[b] = 1;
        }else{
          keys[b] = -1;
          state[b] = -1;
        }  
      }else{
        if(handle){
          use = handle(click[0],click[1],0);
        }
        var id = ''+click[3];
        delete touch_new[id];
        if(!use)
          continue;
        if(b==0){
          touch_cur = id;
          Mouse.x = click[4];
          Mouse.y = click[5];
          state[0] = 1;
          keys[0] = 1;
        }else{
          touch_cur = null;
          Mouse.x = click[0];
          Mouse.y = click[1];
          state[0] = 0;
          keys[0] = -1;
        }
      }
    }
    clicks.length = 0;
  };
  Object.preventExtensions(Mouse);
  return Mouse;
})();//Mouse

Global.Mouse = Mouse; 

})();//KMCO_H5E_Mouse

//EOF