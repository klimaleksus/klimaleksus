// KMCO-H5E-GameEngine.js

"use strict";

(function KMCO_H5E_GameEngine(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

var Keyboard = Global.Keyboard;
var Mouse = Global.Mouse;
var Textbox = Global.Textbox;
var StageTest = Global.StageTest;
var FpsCount = Global.FpsCount;
var FpsTimer = Global.FpsTimer;

var GameEngine = (function GameEngine(GameEngine){
  GameEngine = {
    init: init,
    play: play,
    stop: stop,
    paused: paused,
    canvas: null,
    stage: null,
    fps_gr: null,
    fps_ph: null,
    fps_vsync: function(sync){
      if(sync===true)
        raf = window.requestAnimationFrame;
      else if(sync===false)
        raf = function(cb){
          setTimeout(cb,1);
        };
      return (raf === window.requestAnimationFrame);
    },
    draw: function(){
      var canvas = GameEngine.canvas;
      canvas.draw_clear();
      GameEngine.stage.draw();
      //player.draw();
      //player2.draw();
      textfps.draw();
      canvas.draw_color('','#fff');
      canvas.draw_alpha(0.2);
      //canvas.draw_rect(rect.x1,rect.y1,rect.w2,rect.h2);
      canvas.draw_alpha(1);
      GameMenu.draw();
    }
  };
  var canvas;
  var keys_poll = [];
  var rect = ShapeVector.Rectangle.new();
  var inited = false;
  var active = false;
  var raf;// = window.requestAnimationFrame;
  GameEngine.fps_vsync(true);
  
  /*
  raf = function raf(cb){
    setTimeout(cb,4);
  };//*/
  var count_physics,count_graphics;
  var timer_physics,timer_graphics,timer_title;
  var caller_title;
  var caller_graphics;
  var caller_physics;
  var interval;
  //var oldstate;
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
      if(hash==='#play'){
        if(!active)
          play(false);
      }else if(active){
        //oldstate = true;
        stop('back button pressed');
      }
    });
  };
  function play(enter){
    if(!inited || active)
      return;
    active = true;
    GameMenu.hidden = false;
    //screenfull.request();
    Keyboard.capture();
    Mouse.capture(Const.game_canvas);
    count_physics.start(200);
    count_graphics.start(20);
    caller_title = fps_caller_create(1,0);
    caller_graphics = fps_caller_create(30,-1);
    caller_physics = fps_caller_create(90,10);
    timer_title.reset();//10,0);
    timer_graphics.reset();//30,-1);
    timer_physics.reset();//90,10);
    
    raf(graphics);
    interval = setInterval(physics,6);
    document.body.style.overflow = 'hidden';
    document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    document.body.style.zoom = 1;
    window.scrollTo(0,0);
    document.location.hash = '#play';
    //setTimeout(function(){
      //Mouse.clear();
      //Keyboard.clear();
    //});
    canvas.recalc();
    //oldstate = false;
    GameMenu.hide();
    lags = 0;
    Keyboard.clear();
    if(enter){
      Keyboard.keys[Const.key_enter] = 1;
      Keyboard.reset();
    }
    Mouse.clear();
  };
  function stop(reason){
    if(!inited || !active)
      return;
    GameMenu.hidden = true;
    lags = 0;
    clearInterval(interval);
    interval = -1;
    active = false;
    Keyboard.release();
    Mouse.release();
    caller_title = null;
    caller_graphics = null;
    caller_physics = null;
    document.body.style.overflow = '';
    document.getElementsByTagName('html')[0].style.overflow = '';
    //window.removeEventListener('popstate',popstate,{passive:false,capture:true});
    
    setTimeout(function(){
      if(document.location.hash==='#play')
        history.back();
      else
        fixhash();
    });
    //if(oldstate)
    //  fixhash();
    //else
    //  window.history.back();
    
    //document.location.hash = '#stop';
    //screenfull.exit();
    GameMenu.show(reason);
    graphics();
  };
  function paused(){
    return !active;
  };
  function init(){
    if(inited)
      return;
    inited = true;
    var Const = Global.Const;
    keys_poll.push(
      Const.key_enter,
      Const.key_escape,
      Const.key_up,
      Const.key_down,
      Const.key_left,
      Const.key_right
    );
    Const.game_canvas.addEventListener('mousedown',function(event){
      if(!GameEngine.paused())
        return;
      GameEngine.play(false);
    },{passive:true,capture:false});
    window.addEventListener('keydown',function(e){
      if(GameEngine.paused())
        if(e.keyCode===Const.key_enter)
          GameEngine.play(true);
    },{passive:true,capture:false});
    window.addEventListener('resize',function(e){
      if(!GameEngine.paused())
        GameEngine.stop('window resized');
    },{passive:true,capture:false});
    canvas = Canvas.new(Const.game_canvas,[Const.game_back,Const.game_wrap]);
    GameEngine.canvas = canvas;
    canvas.recalc();
    
    
    count_physics = FpsCount.new();
    count_graphics = FpsCount.new();
    
    timer_title = FpsTimer.new();
    timer_physics = FpsTimer.new();
    timer_graphics = FpsTimer.new();
    
    timer_title.set(10,0);
    timer_graphics.set(30,-1);
    timer_physics.set(90,10);
    
    GameEngine.fps_gr = timer_graphics;
    GameEngine.fps_ph = timer_physics;
    
    //player = GamePlayer();
    //player2 = GamePlayer();
    textfps = Textbox.new(canvas);
    textfps.x = canvas.width/2;
    textfps.y = canvas.height;
    textfps.size = 32;
    textfps.align = 2;
    textfps.text = '';
    textfps.fill.rgb(1,1,1);
    textfps.stroke.a = 0;
    //player.init(false);
    //player2.init(true);
    GameEngine.stage = StageTest.new(canvas);
    GameEngine.stage.init();
    
    GameMenu.init();
    
    rect.xywh(canvas.width*2/3,canvas.height*2/3,canvas.width/8,canvas.height/8);
    GameMenu.show('enter here to start');

    
    graphics();
  };
  //var player,player2,textfps;
  var textfps;
  //var caller_gr = fps_caller_create(15,-1);
  //var caller_ph = fps_caller_create(30,10);
  function graphics(){
    var brk = false;
    if(active)
      raf(graphics);
    else
      brk = true;
    //while(fps_caller_tick(caller_graphics)||brk){
    var one = 1;
    while(timer_graphics.until()||brk){
      one++;
      count_graphics.tick();
      //
      GameEngine.draw();

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
      //while(fps_caller_tick(caller_title)){
      while(timer_title.until()){
        var str = ''+ count_graphics.fps.toFixed(2) + '/' + count_physics.fps.toFixed(2) + '  ('+Keyboard.last+') ~'+timer_physics.lag;
        //document.title = str;
        textfps.text = str;
      }
      if(brk)
        break;
    }
    if(one>2)
      throw 'WTF!? '+one;
  };
  var lags = 0;
  function physics(){
    var looped = 0;
    var lagged = false;
    //while(fps_caller_tick(caller_physics)){
    while(timer_physics.until()){
      if(++looped>9)
        lagged = true;
      count_physics.tick();
      //
      Keyboard.poll(keys_poll);
      Mouse.poll(function(x,y,b){
        //console.log(x,y,b);
        x = canvas.map_x(x);
        y = canvas.map_y(y);
        if(GameMenu.hidden){
          if(b===3){
            GameMenu.toggle();
            return false;
          }
        }else{
          return GameMenu.click(x,y,b);
          // true;
        }
        if(GameEngine.stage.click(x,y,b))
          return false;
        return true;
        //if(x<rect.x1||x>rect.x2||y<rect.y1||y>rect.y2){
        //  return true;
        //}else{
        //  GamePlayer.toggle = !GamePlayer.toggle;
        //  return false;
        //}
      });
      GameMenu.step();
      if(GameMenu.hidden){
        GameEngine.stage.step();
        //player.step();
        //player2.step();
      }
      //
    }
    if(timer_physics.lag>7)
      stop('cpu power lag!!');
    if(lagged){
      if(++lags>7)
        stop('cpu power lag')
    }else
      lags = 0;
  };
  Object.preventExtensions(GameEngine);
  return GameEngine;
})();//GameEngine

Global.GameEngine = GameEngine; 

})();//KMCO_H5E_GameEngine

//EOF