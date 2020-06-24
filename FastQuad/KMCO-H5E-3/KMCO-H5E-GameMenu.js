// KMCO-H5E-GameMenu.js

"use strict";

(function KMCO_H5E_GameMenu(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

var Keyboard = Global.Keyboard;
var Mouse = Global.Mouse;
var Textbox = Global.Textbox;
var Timer = Global.Timer;
var Button = Global.Button;

var GameMenu = (function GameMenu(GameMenu){
  var GameMenu = {
    init: init,
    show: show,
    hide: hide,
    hidden: true,
    draw: draw,
    step: step,
    click: click,
    toggle: toggle,
  };
  var Const;
  var canvas;
  var released;
  var reason;
  var text_paused;
  var text_reason;
  var mainmenu,restartconfirm,activemenu;
  var stopmenu,stopback;
  var timer;
  var hold = 0;
  var arrow = 0;
  //text_reason.multiline = 800;
  function show(text){
    if(!released)
      return;
    released = false;
    hold = 0;
    reason = text;
    stopmenu.clear();
    stopmenu.add_caption('P A U S E D'); 
    stopmenu.add_button('('+text+')');
    stopmenu.commit();
  };
  function hide(){
    if(released)
      return;
    released = true;
    hold = 0;
    Keyboard.keys[Const.key_enter] = 1;
    Keyboard.reset();
  };
  function toggle(){
    GameMenu.hidden = !GameMenu.hidden;
    //Keyboard.keys[Const.key_enter] = 1;
    Keyboard.reset();
    Mouse.clear();
    hold = 0;
    //??
    mainmenu.index = 1;
    activemenu = mainmenu;
  };
  function menu_exit(){
    Keyboard.keys[Const.key_enter] = 1;
    Keyboard.reset();
  };
  var but;
  function draw(){
    //but.fill.h = Math.random();
    //but.draw();
    
    if(released){
      if(!GameMenu.hidden){
        timer.tick();
        activemenu.draw();
      }
      return;
    }else{
      stopback.draw();
      stopmenu.draw();
    }
    /*
    timer.tick();
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
    text_reason.draw();*/
  };
  var delay = 90*0.450;
  var repeat = 90*0.110;
  var hue = 0;
  function step(){
    if(Keyboard.keys[Const.key_escape]>=0){
      GameEngine.stop('escape key pressed');
      return;
    }
    //if(GameMenu.hidden){
    //  if(Keyboard.pressed(Const.key_enter,0,0)){
    //    Keyboard.reset();
        //Keyboard.keys[Const.key_enter] = 1;
     //   GameMenu.hidden = !GameMenu.hidden;
    //    return;
    //  }
      //return;
    //} 
    if(GameMenu.hidden){
      if(Keyboard.pressed(Const.key_enter,0,0))
        toggle();//GameMenu.hidden = false;
      return;
    }
    if(hold){
      var mb = Math.max(Mouse.keys[0],Mouse.keys[1]);
      if(mb>1){
        if(Mouse.pressed(0,delay,repeat) || Mouse.pressed(1,delay,repeat)){
          if(hold===6)
            activemenu.right();
          if(hold===4)
            activemenu.left();
        }
      }
    }
    if(Keyboard.pressed(Const.key_down,delay,repeat))
      activemenu.down();
    if(Keyboard.pressed(Const.key_up,delay,repeat))
      activemenu.up();
    while(Mouse.wheels[0]>0){
      activemenu.down();
      Mouse.wheels[0]--;
    }
    while(Mouse.wheels[0]<0){
      activemenu.up();
      Mouse.wheels[0]++;
    }
    if(Keyboard.pressed(Const.key_left,delay,repeat))
      if(activemenu.left()){
        //arrow = -1;
        //timer.reset('menu');
      }
    if(Keyboard.pressed(Const.key_right,delay,repeat))
      if(activemenu.right()){
        //arrow = 1;
        //timer.reset('menu');
      }
    while(Mouse.wheels[1]>0){
      activemenu.right();
      Mouse.wheels[1]--;
    }
    while(Mouse.wheels[1]<0){
      activemenu.left();
      Mouse.wheels[1]++;
    }
    if(Keyboard.pressed(Const.key_enter,0,0))
      activemenu.enter();
    //if(Mouse.keys[1]>0){
      //console.log('!');
      //activemenu.click(canvas.map_x(Mouse.x),canvas.map_y(Mouse.y));
    //}
    var current = activemenu.current;
    if(current)
      current.stroke.h = hue;
    hue += 0.01;
    if(hue>1)
      hue -= 1;
    activemenu.range_left.stroke.gray(+(arrow<0));
    activemenu.range_right.stroke.gray(+(arrow>0));
    activemenu.range_left.fill.h -= 0.02;
    activemenu.range_right.fill.h -= 0.02;
    
      //current.stroke.a = current.stroke.a+0.01-Math.floor(current.stroke.a);
    //mainmenu.range.fill.h -= 0.02;
    //mainmenu.pressed.fill.h -= 0.02;
  };
  function click(x,y,b){
    if(GameMenu.hidden)
      return false;
    hold = 0;
    if(b===3){
      activemenu.enter();
      return false;
    }
    if(b<2){
      var r = activemenu.click(x,y);
      //  console.log(r);
      if(r===6 || r===4){
        hold = r;
        return true;
        //arrow = r;
        //timer.reset('menu');
      }
    }
    return false;
  };

  function init(){
    GameMenu.init = null;
    GameMenu.hidden = true;
    Const = Global.Const;
    canvas = Global.GameEngine.canvas;
    released = true;
    reason = '';
    
  but = Button.new(canvas);
  but.fill.hsl(0,0.8,0.4);
  but.rect(0,0,canvas.width,canvas.height,7);
  
    
    timer = Timer.new();
    timer.start('menu',2,function(){
      arrow = 0;
    });
    
    /*
    text_paused = Textbox.new(canvas);
    text_paused.text = 'P A U S E D';
    text_paused.size = 64;
    text_paused.line = 2;
    text_paused.pad(64,48);
    text_paused.fill.rgb(0,0,0);
    text_paused.xy(canvas.width/2,canvas.height/2,2);
    text_reason = Textbox.new(canvas);
    text_reason.text = 'P A U S E D';
    text_reason.size = 48;
    text_reason.line = 1;
    text_reason.pad(64,0);
    text_reason.fill.rgb(0,0,0);
    text_reason.xy(canvas.width/2,canvas.height/2,8);
    */
    
    stopback = Button.new(canvas);
    stopback.line = 0;
    stopback.fill.graya(1,0.5);
    stopback.rect(0,0,canvas.width,canvas.height,7);
    
    stopmenu = Options.new(canvas);
    stopmenu.pad(24,24);
    //stopmenu.pad(0,0);
    stopmenu.fill.gray(1);
    stopmenu.stroke.gray(0);
    stopmenu.line = 4;
    stopmenu.font.size = 64;
    stopmenu.font.fix_y = -8;
    stopmenu.font.line = 2;
    stopmenu.font.pad(64,24);
    stopmenu.font.fill.gray(0);
    stopmenu.xy(canvas.width/2,canvas.height/2,5);
    stopmenu.caption.copy(stopmenu.font);
    stopmenu.select.copy(stopmenu.font);
    stopmenu.select.size = 48;
    stopmenu.select.line = 1;
    stopmenu.select.pad(64,24);
    
    //canvas.draw_color('#000','#fff',4);
    //canvas.draw_rect(x1,y1,x2-x1,y2-y1);
    //text_paused.draw();
    
    mainmenu = Options.new(canvas);
    mainmenu.xy(canvas.width/2,canvas.height/2,5);
    mainmenu.fill.graya(0.6,0.8);
    mainmenu.stroke.gray(1);
    mainmenu.line = 8;
    mainmenu.pad(20,20);
    
    mainmenu.font.line = 0;
    mainmenu.font.fix_y = -8;
    mainmenu.font.size = 64;
    mainmenu.font.pad(25,15);
    mainmenu.font.fill.gray(0);
    mainmenu.font.stroke.gray(1);

    mainmenu.caption.copy(mainmenu.font);
    mainmenu.caption.line = 8;

    mainmenu.select.copy(mainmenu.font);
    mainmenu.select.line = 14;
    mainmenu.select.stroke.hsl(0,0.9,0.4);
    mainmenu.select.fill.gray(1);

    mainmenu.range_right.copy(mainmenu.font);
    mainmenu.range_right.line = 8;
    mainmenu.range_right.stroke.gray(0);
    mainmenu.range_right.fill.hsl(0,1,0.75);
    
    mainmenu.range_left.copy(mainmenu.range_right);
    //mainmenu.pressed.stroke.gray(1);


    mainmenu.onmove = function(d){
      if(d===6){
        arrow = 1;
        timer.reset('menu');
      }else if(d===4){
        arrow = -1;
        timer.reset('menu');
      }
    };

    restartconfirm = Options.new(canvas);
    restartconfirm.copy(mainmenu);
    restartconfirm.font.pad(48,40);
    restartconfirm.select.pad(48,40);
    restartconfirm.pad(48,32);

    var m_options,m_video;
    m_options = Options.new(canvas).copy(mainmenu);
    m_video = Options.new(canvas).copy(mainmenu);
    //restartconfirm.add_button('2');

    mainmenu.add_caption('MENU');
    mainmenu.add_button('[ Continue game ]',function(){
      //GameMenu.hidden = true;  
      toggle();
    });
    mainmenu.add_button('Restart stage',function(){
      activemenu = restartconfirm;
    });
    restartconfirm.add_caption('Restart?');
    //restartconfirm.add_caption('YES      NO');
    //restartconfirm.add_button('1');
    restartconfirm.add_question('YES','NO',false,function(yes){
      if(yes){
        GameEngine.stage.init();
        toggle();
      }else
        activemenu = mainmenu;
      return false;
    });
    restartconfirm.commit();
   
    /*
    mainmenu.add_list(['111','222','333'],1,null,'AAA:');
    mainmenu.add_range(0,'9999999%',function(index,text,dir){
      return index+dir;
    },function(index){
      return ''+index+'%';
    },'BBB:');
    */
    
    mainmenu.add_button('Options...',function(){
      activemenu = m_video;//m_options;
      activemenu.index = 1;
    });

    mainmenu.add_button('TEST!',function(){
      swapstage();      
    });
    
    mainmenu.add_button('Stop/pause JS',function(){
      setTimeout(function(){
        GameEngine.stop('from menu');
      });
    });
    
    /*
    mainmenu.add_list(['text','100%','*'],0,null);
    mainmenu.add_button('444');
    mainmenu.add_button('555');
    mainmenu.add_caption('!!!!!text!!!!!!!');
    mainmenu.add_button('666');
    //mainmenu.index = 0;

    */
    mainmenu.commit();
    
    m_options.add_caption('OPTIONS');
    m_options.add_button('[ Back to menu ]',function(){
      activemenu = mainmenu;
    });
    m_options.add_button('Video settings...',function(){
      activemenu = m_video;
      activemenu.index = 1;
    });
    m_options.add_button('Input controls...',function(){
      //activemenu = m_video;
    });
    m_options.commit();

    m_video.add_caption('VIDEO');
    m_video.add_button('[ Back to options ]',function(){
      activemenu = mainmenu;//m_options;
    });
    m_video.add_range(100,'999%',function(value,text,dir){
      var v = value+dir*5;
      if(v<=35)
        v = 33;
      if(v>33 && v<40)
        v = 40;
      if(v>300)
        v = 300;
      if(v!==value){
        canvas._quality = v/100;
        canvas.recalc();
        GameEngine.draw();
      }
      return v;
    },function(value){
      return ''+value+'%';
    },'Resolution:');
    /*
    m_video.add_range(0,'999%',function(value,text,dir){
      var v = value+dir;
      if(v!==value){
        canvas._padding = v;
        canvas.recalc();
        GameEngine.draw();
      }
      return v;
    },function(value){
      return ''+value+'';
    },'Padding:');
    */
    m_video.add_list(['no..','YES!'],+canvas._smooth,function(index,array,dir){
      if(!dir)
        index = 1-index;
      canvas._smooth = !!index;
      canvas.recalc();
      GameEngine.draw();
      return index;
    },'Smoothing:');
    m_video.add_range(GameEngine.fps_gr.fps,'999',function(value,text,dir){
      value = value+dir*5;
      if(value<10)
        value = 10;
      else if(value>90)
        value = 90;
      GameEngine.fps_gr.fps = value;
      return value;
    },function(value){
      return ''+value;
    },'FPS:');
    m_video.add_list(['NO!','yes..'],+canvas._round,function(index,array,dir){
      if(!dir)
        index = 1-index;
      canvas._round = index;
      canvas.recalc();
      GameEngine.draw();
      return index;
    },'Flat:');
    m_video.add_list(['no..','YES!'],+GameEngine.fps_vsync(),function(index,array,dir){
      if(!dir)
        index = 1-index;
      GameEngine.fps_vsync(!!index);
      return index;
    },'VSync:');
    m_video.commit();
   
    
    activemenu = mainmenu;
    
    function swapstage(){
      if(swapstage.videostage){
        if(GameEngine.stage===swapstage.videostage)
          GameEngine.stage = swapstage.oldstage;
        else
          GameEngine.stage = swapstage.videostage;
        return;
      }
      var StageVideo = Global.StageVideo;
      swapstage.videostage = StageVideo.new(canvas);
      swapstage.videostage.init();
      swapstage.oldstage = GameEngine.stage;
      GameEngine.stage = swapstage.videostage;
      toggle();
    };    
  };
  Object.preventExtensions(GameMenu);
  return GameMenu;
})();//GameMenu

Global.GameMenu = GameMenu; 

})();//KMCO_H5E_GameMenu

//EOF