// KMCO-H5E-2.js

"use strict";

var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

//alert(window.innerWidth+'*'+window.innerHeight);

window.pref_now = window.performance && (performance.now || performance.webkitNow || performance.mozNow || performance.msNow).bind(performance) || Date.now && Date.now.bind(Date) || function(){return new Date().getTime();};

function Deterministic(v){
  return Math.floor(v*1000000000000+.5)/1000000000000;
};

//var quad = FastQuad.new(-1024,-1024,2048);
var game_canvas = GEBI('game_canvas');
var game_back = GEBI('game_back');
var game_wrap = GEBI('game_wrap');

//var MouseKeyboard = window.MouseKeyboard;
var Mouse = Global.Mouse;
var Keyboard = Global.Keyboard;

var Inherit = Global.Inherit;
var Private = Inherit.Private;
var Base = Inherit.Base;

var Color = Global.Color;
var Textbox = Global.Textbox;


var Canvas = Global.Canvas;
var canvas = Canvas.new(game_canvas,[game_back,game_wrap]);

var rect = ShapeVector.Rectangle.new();

canvas.recalc();
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
var PI = Math.PI;

var 
  key_esc = 27,
  key_up = 38,
  key_down = 40,
  key_left = 37,
  key_right = 39,
  keys_poll = [key_esc,key_up,key_down,key_left,key_right];

function key_pair(main,back){
  return main>0 && main>back;
};

var toggle = false;

var oldmenu = false;
var old_x = 0;
var old_y = 0;

var sqrt = Math.sqrt;
var atan2 = Math.atan2;
var sin = Math.sin;
var cos = Math.cos;
var abs = Math.abs;

var Player = function Player(){
return {
  init: function(mouse){
    this.x = 320;
    this.y = 240;
    this.r = 32;
    this.move_x = 0;
    this.move_y = 0;  
    this.move_ax = 0;
    this.move_ay = 0;
    this.mouse = !!mouse;
  },
  draw: function(){
    canvas.draw_color('#eee',toggle?'#aaa':'',10);
    canvas.draw_circle(this.x,this.y,this.r);
    if(this.mouse){
      canvas.draw_color('#eee',toggle?'#aaa':'');
      canvas.draw_circle(this.x+this.move_ax,this.y+this.move_ay,this.r/3);
    }else{
      canvas.draw_color('#eee',toggle?'#aaa':'');
      canvas.draw_circle(this.x+this.move_ax,this.y+this.move_ay,this.r/2);
      canvas.draw_color('#eee','');
      canvas.draw_circle(this.x+this.move_x*50,this.y+this.move_y*50,this.r/2);
    }
    canvas.draw_font(50);
    canvas.draw_color('#fff','#999');
    canvas.draw_text(canvas.width/2,0,8,(window.innerWidth|0)+','+(window.innerHeight|0)+'\n'+(window.devicePixelRatio||0).toFixed(2));
    if(this.mouse){
      canvas.draw_text(0,0,7,(this.x|0)+','+(this.y|0));
    }else{
      canvas.draw_text(canvas.width,0,9,(this.x|0)+','+(this.y|0));
    }
  },
  step: function(){
    var keys = Keyboard.keys;
    var mouse_x = canvas.map_x(Mouse.x);
    var mouse_y = canvas.map_y(Mouse.y);
    var click = Mouse.keys[1]>0;
    //if(Mouse.key[0]>0)
    //  console.debug(Mouse.key[0]);
    var menu = Mouse.keys[2]>0;
    menu = menu || Mouse.keys[0]>0;
    var up = key_pair(keys[key_up],keys[key_down]);
    var down = key_pair(keys[key_down],keys[key_up]);
    var left = key_pair(keys[key_left],keys[key_right]);
    var right = key_pair(keys[key_right],keys[key_left]);
    var tgt_x = 0;
    var tgt_y = 0;
    var tgt_p = 4;
    var tgt_m = 50;
    if(right)
      tgt_x = 1;
    else if(left)
      tgt_x = -1;
    if(down)
      tgt_y = 1;
    else if(up)
      tgt_y = -1;
    this.move_x += (tgt_x-this.move_x)/tgt_p;
    this.move_y += (tgt_y-this.move_y)/tgt_p;
    if(!this.mouse){
      var a = atan2(this.move_y,this.move_x);
      this.move_ax = this.move_x*abs(cos(a))*tgt_m;
      this.move_ay = this.move_y*abs(sin(a))*tgt_m;
    }else{
      if(menu){
        if(!oldmenu){
          oldmenu = true;
          //old_x = mouse_x;
          //old_y = mouse_y;
          old_x = mouse_x-this.x;
          old_y = mouse_y-this.y;
        }
      }else{
        oldmenu = false;
      }
      if(click || menu){
        var vx,vy;
        if(menu){
          //vx = mouse_x-old_x;
          //vy = mouse_y-old_y;
          vx = mouse_x-old_x-this.x;
          vy = mouse_y-old_y-this.y;
        }else{
          vx = mouse_x-this.x;
          vy = mouse_y-this.y;
        }
        var va = atan2(vy,vx);
        var vdd = vx*vx+vy*vy;
        if(vdd>tgt_m*tgt_m){
          vx = tgt_m*cos(va);
          vy = tgt_m*sin(va);
        }
        this.move_ax += (vx-this.move_ax)/tgt_p;
        this.move_ay += (vy-this.move_ay)/tgt_p;
      }else{
        this.move_ax += (0-this.move_ax)/tgt_p;
        this.move_ay += (0-this.move_ay)/tgt_p;
      }
    }
    this.x += this.move_ax/10;
    this.y += this.move_ay/10;
  },
}};

var Game = (function Game(Game){
Game = {
  init: init,
  play: play,
  stop: stop,
  paused: paused,
};
var inited = false;
var active = false;
var raf = window.requestAnimationFrame;
/*
raf = function raf(cb){
  setTimeout(cb,4);
};//*/
var timer_graphics;
var timer_physics;
var fps_graphics = 0;
var fps_physics = 0;
var caller_title;
var caller_graphics;
var caller_physics;
var interval;
var oldstate;
var fixhash = function(){
  document.location.replace((document.location.href+'#').replace(/#.*/,'#'));
};
fixhash();
setTimeout(function(){
  window.addEventListener('popstate',popstate,{passive:true,capture:true});
});
function popstate(e){
  setTimeout(function(){
    var hash = document.location.hash;
    //console.log(hash,active);
    if(hash=='#play'){
      if(!active)
        play();
    }else if(active){
      oldstate = true;
      stop('back button pressed');
    }
  });
};
function play(){
  if(!inited)
    return;
  active = true;
  //screenfull.request();
  Keyboard.capture();
  Mouse.capture(game_canvas);
  timer_graphics = fps_timer_create(20);
  timer_physics = fps_timer_create(200);
  caller_title = fps_caller_create(1,0);
  caller_graphics = fps_caller_create(30,-1);
  caller_physics = fps_caller_create(90,10);
  raf(graphics);
  interval = setInterval(physics,6);
  fps_graphics = 0;
  fps_physics = 0;
  document.body.style.overflow = 'hidden';
  document.getElementsByTagName('html')[0].style.overflow = 'hidden';
  document.body.style.zoom = 1;
  window.scrollTo(0,0);
  document.location.hash = '#play';
  setTimeout(function(){
    Mouse.clear();
    Keyboard.clear();
  },1);
  canvas.recalc();
  Mouse.clear();
  Keyboard.clear();
  oldstate = false;
  Menu.hide();
  lags = 0;
};
function stop(reason){
  if(!inited)
    return;
  lags = 0;
  clearInterval(interval);
  interval = -1;
  active = false;
  Keyboard.release();
  Mouse.release();
  timer_graphics = null;
  timer_physics = null;
  caller_title = null;
  caller_graphics = null;
  caller_physics = null;
  fps_graphics = 0;
  fps_physics = 0;
  document.body.style.overflow = '';
  document.getElementsByTagName('html')[0].style.overflow = '';
  //window.removeEventListener('popstate',popstate,{passive:false,capture:true});
  if(oldstate)
    fixhash();
  else
    window.history.back();
  //document.location.hash = '#stop';
  //screenfull.exit();
  Menu.show(reason);
  graphics();
};
function paused(){
  return !active;
};
function init(){
  if(inited)
    return;
  inited = true;
  player = Player();
  player2 = Player();
  textfps = Textbox.new(canvas);
  textfps.x = canvas.width/2;
  textfps.y = canvas.height;
  textfps.size = 32;
  textfps.align = 2;
  textfps.text = '';
  textfps.fill.rgb(1,1,1);
  textfps.stroke.visible = false;
  player.init(false);
  player2.init(true);
  rect.xywh(canvas.width*2/3,canvas.height*2/3,canvas.width/8,canvas.height/8);
  Menu.show('enter here to start');
  graphics();
};
var player,player2,textfps;
//var caller_gr = fps_caller_create(15,-1);
//var caller_ph = fps_caller_create(30,10);
function graphics(){
  var brk = false;
  if(active)
    raf(graphics);
  else
    brk = true;
  while(fps_caller_tick(caller_graphics)||brk){
    fps_graphics = fps_timer_tick(timer_graphics);
    //
    canvas.draw_clear();
    player.draw();
    player2.draw();
    var mouse_x = canvas.map_x(Mouse.x);
    var mouse_y = canvas.map_y(Mouse.y);
    var col = '#ff0';
    if(Mouse.keys[0]>0)
      col = '#0f0';
    else if(Mouse.keys[1]>0)
      col = '#0ff';
    else if(Mouse.keys[2]>0)
      col = '#f0f';
    canvas.draw_color(col,'',4);
    if(!brk)
      canvas.draw_cross(mouse_x,mouse_y,16);
    //
    while(fps_caller_tick(caller_title)){
      var str = ''+ fps_graphics.toFixed(2) + '/' + fps_physics.toFixed(2) + '  ('+Keyboard.last+')'+' '+Mouse.keys[0]+' ('+(Mouse.x|0)+','+(Mouse.y|0)+')';
      //document.title = str;
      textfps.text = str;
    }
    textfps.draw();
    canvas.draw_color('','#fff');
    canvas.draw_alpha(0.2);
    canvas.draw_rect(rect.x1,rect.y1,rect.w2,rect.h2);
    canvas.draw_alpha(1);
    Menu.draw();
    if(brk)
      break;
  }
};
var lags = 0;
function physics(){
  var looped = 0;
  var lagged = false;
  while(fps_caller_tick(caller_physics)){
    if(++looped>9)
      lagged = true;
    fps_physics = fps_timer_tick(timer_physics);
    //
    Keyboard.poll(keys_poll);
    Mouse.poll(function(x,y,b){
      //console.log(x,y,b);
      x = canvas.map_x(x);
      y = canvas.map_y(y);
      if(x<rect.x1||x>rect.x2||y<rect.y1||y>rect.y2){
        return true;
      }else{
        toggle = !toggle;
        return false;
      }
    });
    if(Keyboard.keys[27]>=0){
      stop('escape key pressed');
      return;
    }
    player.step();
    player2.step();
    //
  }
  if(lagged){
    if(++lags>7)
      stop('cpu power lag')
  }else
    lags = 0;
};
return Game;
})();

setTimeout(function(){
  game_canvas.addEventListener('click',function(event){
    if(!Game.paused())
      return;
    Game.play();
  });
  Game.init();
});

window.addEventListener('keydown',function(e){
  if(Game.paused())
    if(e.keyCode===13)
      Game.play();
});

var Menu = (function Menu(){
  var Menu = {
    show: show,
    hide: hide,
    active: active,
    draw: draw,
  };
  var hidden = true;
  var reason = '123';
  var text_paused = Textbox.new(canvas);
  text_paused.text = 'P A U S E D';
  text_paused.size = 64;
  text_paused.line = 2;
  text_paused.pad(64,48);
  text_paused.fill.rgb(0,0,0);
  text_paused.xy(canvas.width/2,canvas.height/2,2);
  var text_reason = Textbox.new(canvas);
  text_reason.text = 'P A U S E D';
  text_reason.size = 48;
  text_reason.line = 1;
  text_reason.pad(64,0);
  text_reason.fill.rgb(0,0,0);
  text_reason.xy(canvas.width/2,canvas.height/2,8);
  //text_reason.multiline = 800;
  function active(){
    return !hidden;
  };
  function show(text){
    if(!hidden)
      return;
    hidden = false;
    reason = text;
  };
  function hide(){
    if(hidden)
      return;
    hidden = true;
  };
  function draw(){
    if(hidden)
      return;
    canvas.draw_alpha(0.5);
    canvas.draw_color('','#fff');
    canvas.draw_rect(0,0,canvas.width,canvas.height);
    canvas.draw_alpha(1);
    text_reason.text = '('+reason+')';
    var x1 = Math.min(text_paused.x1,text_reason.x1);
    var y1 = text_paused.y1;
    var x2 = Math.max(text_paused.x2,text_reason.x2);
    var y2 = text_reason.y2+text_paused.pad_y;
    canvas.draw_color('#000','#fff',4);
    canvas.draw_rect(x1,y1,x2-x1,y2-y1);
    text_paused.draw();
    text_reason.draw();
  };
  return Menu;
})();


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

function fps_timer_create(average){
  average = average |0;
  var obj = {
    _first: 0,
    _last: 0,
    _count: 1,
    _aver: average,
    _arr: [pref_now()],
  };
  obj._arr.length = average;
  return obj;
};

function fps_timer_tick(obj){
  if(!obj)
    return 0;
  var arr = obj._arr;
  var curr = pref_now();
  var fps;
  if(obj._count<obj._aver){
    fps = (curr-arr[0])/obj._count;
    arr[obj._count++] = curr;
  }else{
    fps = (curr-arr[obj._count%obj._aver])/obj._aver;
    arr[(obj._count++)%obj._aver] = curr;
  }
  return 1000/fps;
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