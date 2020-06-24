// KMCO-H5E-3.js

"use strict";

var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

function errhandler(e){
  window.removeEventListener('error',errhandler);
  alert('ERROR\n'+e.message+'\n'+e.filename+':'+e.lineno+':'+e.colno+'\n'+(e&&e.error&&e.error.stack||''));
};
window.addEventListener('error',errhandler);

window.pref_now = window.performance.now.bind(performance);
//window.pref_now = window.performance && (performance.now || performance.webkitNow || performance.mozNow || performance.msNow).bind(performance) || Date.now && Date.now.bind(Date) || function(){return new Date().getTime();};

function Deterministic(v){
  //Math.fround
  return Math.floor(v*1000000000000+.5)/1000000000000;
};

//var quad = FastQuad.new(-1024,-1024,2048);

var Const = {
  game_canvas: GEBI('game_canvas'),
  game_back: GEBI('game_back'),
  game_wrap: GEBI('game_wrap'),
  key_escape: 27,
  key_up: 38,
  key_down: 40,
  key_left: 37,
  key_right: 39,
  key_enter: 13,
};
Object.preventExtensions(Const);

Global.Const = Const;

//var MouseKeyboard = window.MouseKeyboard;
var Mouse = Global.Mouse;
var Keyboard = Global.Keyboard;

var Inherit = Global.Inherit;
var Private = Inherit.Private;
var Base = Inherit.Base;

var Color = Global.Color;
var Textbox = Global.Textbox;
var Options = Global.Options;
var GameMenu = Global.GameMenu;
var GameEngine = Global.GameEngine;

var Canvas = Global.Canvas;
/*
var ShapeVector = window.ShapeVector;
var Vector = ShapeVector.Vector;
var Circle = ShapeVector.Circle;
var Square = ShapeVector.Square;
var Ellipse = ShapeVector.Ellipse;
var Rectangle = ShapeVector.Rectangle;
var Segment = ShapeVector.Segment;
var Intersect = ShapeVector.Intersect;
*/




setTimeout(GameEngine.init);

  /*  
throw '(not an error)';

////////////////////////////////////////////////////////////////////////////
//========================================================================//
////////////////////////////////////////////////////////////////////////////

var bullets = [];
var size = 16;
var width = canvas.width;
var height = canvas.height;
bullets.length = 100;
var game_div = GEBI('game_div');
for(var i=0,n=bullets.length; i<n; i++){
  bullets[i] = {
    x: random_range(0,width),
    y: random_range(0,height),
    sx: random_sign(random_range(1,10))/10,
    sy: random_sign(random_range(1,10))/10,
    w: random_range(2,40),
    h: random_range(2,40),
    q: null,
  };
};

function bullets_add(){
  quad.Root().Clear();
  for(var i=0,n=bullets.length; i<n; i++){
    var bull = bullets[i];
    bull.q = quad.Add(bull,bull.x,bull.y,bull.w,bull.h);
  }
};

function bullets_move(){
  for(var i=0,n=bullets.length; i<n; i++){
    var bull = bullets[i];
    bull.q = bull.q.Move(bull,bull.x,bull.y,bull.w,bull.h);
  }
};

var paused = false;
var mouse = false;
var tree = true;

document.onclick = function(event){
  if(event.button===2)
    return;
  tree = !tree;
};

canvas.onmouseleave = function(event){
  mouse = false;
}

document.oncontextmenu = function(event){
  paused = !paused;
  event.preventDefault();
  event.stopPropagation();
  return false;
};

var mouse_x=0,mouse_y=0;
var mouse_w = 96;
var mouse_h = 48;

canvas.onmousemove = function(event){
  var rect = canvas.getBoundingClientRect();
  mouse_x = event.clientX - rect.left;
  mouse_y = event.clientY - rect.top;
  mouse = true;
};

bullets_add();

function bullets_update(){
  for(var i=0,n=bullets.length; i<n; i++){
    var bull = bullets[i];
    bull.x += bull.sx;
    bull.y += bull.sy;
    if(bull.x > width)
      bull.x -= width+bull.w;
    if(bull.x+bull.w < 0)
      bull.x += width+bull.w;
    if(bull.y > height)
      bull.y -= height+bull.h;
    if(bull.y+bull.h < 0)
      bull.y += height+bull.h;
  }
};

function bullets_draw(){
  for(var i=0,n=bullets.length; i<n; i++){
    var bull = bullets[i];
    var c = size2color(bull.q.size);
    draw_ellipse(bull.x,bull.y,bull.w,bull.h,c);
  }
};

function draw_mouse(){
  draw_stroke(mouse_x-mouse_w/2,mouse_y-mouse_h/2,mouse_w,mouse_h,'#fff');
};

function draw_found(){
  var q = quad.Find(mouse_x-mouse_w/2,mouse_y-mouse_h/2,mouse_w,mouse_h);
  while(q){
    square(q,true);
    q.array.forEach(function(bull){
      draw_ellipse(bull.x,bull.y,bull.w,bull.h,'#fff');
    });
    q = q.next;
  }
};

function bullets_debug(){
  for(var i=0,n=bullets.length; i<n; i++){
    var bull = bullets[i];
    square(bull.q,true);
  }
};

function size2color(s){
  if(!size2color.arr)
    size2color.arr = [
      '#444','#f88','#ff4','#4f4','#4ff','#88f','#f8f','#999','#fff',
    ];
  if(!s)
    return '#fff';
  s = Math.log(s)/Math.log(2);
  s = 9-s+1;
  return size2color.arr[s] || '#fff';
};

function square(q,white){
  if(white)
    ctx.strokeStyle = '#eee';
  else
    ctx.strokeStyle = size2color(q.size);
  ctx.beginPath();
  path_line(q.x,q.y-q.size,q.x,q.y+q.size);
  path_line(q.x-q.size,q.y,q.x+q.size,q.y);
  ctx.stroke();
};

function quad_draw(){
  var s = quad.Root().Each(true);
  while(s){
    square(s);
    s = s.next;
  }
};

function random_range(a,b){
  return a+Math.random()*(b-a);
};

function random_sign(x){
  return Math.random()<.5 ? x : -x;
};

var myraf = function(tick){
setTimeout(tick,0);
};

setTimeout(function(){
  var timer = fps_timer_create(20);
  var oldtime = Date.now();
  var delay = 0;
  myraf(function tick(){
    myraf(tick);
    var newtime = Date.now();
    delay += (newtime-oldtime-delay)/10;
    oldtime = newtime;
    document.title = ''+ fps_timer_tick(timer).toFixed(2)+'  |  '+(1000/delay).toFixed(2);
    draw_clear(0,0,canvas.width,canvas.height);
    //bullets_debug();
    if(!paused){
      bullets_update();
      bullets_move();
    }
    bullets_draw();
    if(tree)
      quad_draw();
    if(mouse){
      draw_mouse();
      draw_found();
    }
  });
},0);
*/
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

function line(a,b,p){
  return a+(b-a)*p;
}

function draw_fill(x,y,w,h,c){
  ctx.fillStyle = c;
  ctx.fillRect(x,y,w,h);
};

function path_circle(x,y,r){
  ctx.arc(x,y,r,0,2*Math.PI,false);
};

function path_ellipse(x,y,w,h){
  w = w/2 |0;
  h = h/2 |0;
  if(!w||!h)
    return;
  ctx.save();
  ctx.translate(x+w,y+h);
  ctx.scale(w,h);
  path_circle(0,0,1);
  ctx.restore();
};

function draw_ellipse(x,y,w,h,c){
  ctx.beginPath();
  path_ellipse(x,y,w,h);
  ctx.strokeStyle = c;
  ctx.stroke();
};

function draw_stroke(x,y,w,h,c){
  ctx.strokeStyle = c;
  ctx.strokeRect((x|0)+.5,(y|0)+.5,w|0,h|0);
};

function path_line(x1,y1,x2,y2){
  ctx.moveTo((x1|0)+.5,(y1|0)+.5);
  ctx.lineTo((x2|0)+.5,(y2|0)+.5);
};

function draw_clear(x,y,w,h){
  return ctx.clearRect(x,y,w,h);
}

function GEBI(id){
  return document.getElementById(id);
}

//EOF