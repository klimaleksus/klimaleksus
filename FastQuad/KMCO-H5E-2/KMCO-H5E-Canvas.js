// KMCO-H5E-Canvas.js v1.0

"use strict";

(function KMCO_H5E_Canvas(){

var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

var Canvas = (function Canvas(Canvas){
  var Inherit = Global.Inherit;
  var Private = Inherit.Private;
  var Base = Inherit.Base;
  var width = 1000;
  var ratio = 4/3;
  var height = width*ratio;
  var align_x = ['start',
    'left','center','right',
    'left','center','right',
    'left','center','right',
  ];
  var align_y = ['alphabetic',
    'bottom','bottom','bottom',
    'middle','middle','middle',
    'top','top','top',
  ];
  return Canvas = Inherit(Inherit.Base,{
    _quality: 1,
    _round: false,
    width: width,
    ratio: ratio,
    height: height,
    $new: function(canvas,divs){
      Base.$new.call(this);
      this._canvas = canvas;
      this._divs = divs;
      console.log(this);
    },
    $delete: function(){
      Base.$delete.call(this);
    },
    recalc: recalc,
    draw_clear: draw_clear,
    draw_circle: draw_circle,
    draw_rect: draw_rect,
    draw_cross: draw_cross,
    draw_color: draw_color,
    draw_alpha: draw_alpha,
    draw_font: draw_font,
    draw_text: draw_text,
    text_width: text_width,
    text_multiline: text_multiline,
    map_x: map_x,
    map_y: map_y,
    _canvas$: null,
    _divs$: null,
    _ctx$: null,
    _canvas_width$: 0,
    _canvas_height$: 0,
    _filled$: false,
    _stroked$: false,
    _fact_x$: 0,
    _fact_y$: 0,
    _fact_r$: 0,
    _fact_t$: 0,
    _mult_x$: 0,
    _mult_y$: 0,
    _mult_r$: 0,
    _PI2: 2*Math.PI,
    _old_text_height$: 0, // todo: round change
    _old_line_width$: 0,
    _old_stroke_style$: '',
    _old_fill_style$: '',
  },'Canvas');
  function recalc(){
    var w = window.innerWidth;
    var h = window.innerHeight;
    var f = 1;
      if(h/w<=this.ratio)
        f = h/this.height;
      else
        f = w/this.width;
    var sx = this.width*f+'px';
    var sy = this.height*f+'px';
    this._canvas.style.width = sx;
    this._canvas.style.height = sy;
    if(this._divs)
      for(var i=0,n=this._divs.length; i<n; i++){
        this._divs[i].style.width = sx;
        this._divs[i].style.height = sy;
      }
    var pr = window.devicePixelRatio||1;
    this._canvas_width = this.width*f*this._quality*pr|0;
    this._canvas_height = this.height*f*this._quality*pr|0;
    this._fact_x = 1/f;
    this._fact_y = this._fact_x;
    this._fact_r = (this._fact_x+this._fact_y)/2;
    this._fact_t = this._fact_x/pr;
    this._mult_x = f*this._quality*pr;
    this._mult_y = this._mult_x;
    this._mult_r = (this._mult_x+this._mult_y)/2;
    var canvas = this._canvas;
    this._canvas.width = this._canvas_width;
    this._canvas.height = this._canvas_height;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = 'high';
    ctx.filter = 'none';
    ctx.direction = 'ltr';
    this._ctx = ctx;
  };
  function map_x(x){
    return x*this._fact_x;
  };
  function map_y(y){
    return y*this._fact_y;
  };
  function draw_clear(){
    this._ctx.clearRect(0,0,this._canvas_width,this._canvas_height);
  };
  function draw_color(stroke,fill,line){
    if(stroke){
      this._stroked = true;
      if(this._old_stroke_style!==stroke)
        this._ctx.strokeStyle = this._old_stroke_style = stroke;
    }else
      this._stroked = false;
    if(fill){
      this._filled = true;
      if(this._old_fill_style!==fill)
        this._ctx.fillStyle = this._old_fill_style = fill;
    }else
      this._filled = false;
    if(line && this._old_line_width!=line){
      this._old_line_width = line;
      this._ctx.lineWidth = this._round?(line*this._mult_r|0):line*this._mult_r;
    }
  };
  function draw_font(size,line){
    if(size && this._old_text_height!=size){
      this._old_text_height = size;
      this._ctx.font = 'normal '+(this._round?(size*this._mult_r|0):size*this._mult_r)+'px Arial';
    }
    if(line && this._old_line_width!=line){
      this._old_line_width = line;
      this._ctx.lineWidth = this._round?(line*this._mult_r|0):line*this._mult_r;
    }
  };
  function draw_alpha(alpha){
    this._ctx.globalAlpha = alpha;
  };
  function draw_circle(x,y,r){
    var ctx = this._ctx;
    ctx.beginPath();
    if(this._round)
      ctx.arc((x*this._mult_x|0)+.5,(y*this._mult_y|0)+.5,r*this._mult_r|0,0,this._PI2);
    else
      ctx.arc(x*this._mult_x,y*this._mult_y,r*this._mult_r,0,this._PI2);
    if(this._filled)
      ctx.fill();
    if(this._stroked)
      ctx.stroke();
  };
  function draw_cross(x,y,r){
    var ctx = this._ctx;
    var mx = this._mult_x;
    var my = this._mult_y;
    ctx.beginPath();
    if(this._round){
      ctx.moveTo(((x-r)*mx|0)+.5,(y*my|0)+.5);
      ctx.lineTo(((x+r)*mx|0)+.5,(y*my|0)+.5);
      ctx.moveTo((x*mx|0)+.5,((y-r)*my|0)+.5);
      ctx.lineTo((x*mx|0)+.5,((y+r)*my|0)+.5);
    }else{
      ctx.moveTo((x-r)*mx,y*my);
      ctx.lineTo((x+r)*mx,y*my);
      ctx.moveTo(x*mx,(y-r)*my);
      ctx.lineTo(x*mx,(y+r)*my);
    }
    if(this._filled)
      ctx.fill();
    if(this._stroked)
      ctx.stroke();
  };
  function draw_rect(x,y,w,h){
    var mx = this._mult_x;
    var my = this._mult_y;
    if(this._round){
      if(this._filled)
        this._ctx.fillRect(x*mx|0,y*my|0,w*mx|0,h*my|0);
      if(this._stroked)
        this._ctx.strokeRect(x*mx|0,y*my|0,w*mx|0,h*my|0);
    }else{
      if(this._filled)
        this._ctx.fillRect(x*mx,y*my,w*mx,h*my);
      if(this._stroked)
        this._ctx.strokeRect(x*mx,y*my,w*mx,h*my);
    }
  };
  function draw_text(x,y,align,text){
    var ctx = this._ctx;
    ctx.textAlign = align_x[align];
    ctx.textBaseline = align_y[align];
    if(this._round){
      if(this._stroked)
        ctx.strokeText(text,x*this._mult_x|0,y*this._mult_y|0);
      if(this._filled)
        ctx.fillText(text,x*this._mult_x|0,y*this._mult_y|0);
    }else{
      if(this._stroked)
        ctx.strokeText(text,x*this._mult_x,y*this._mult_y);
      if(this._filled)
        ctx.fillText(text,x*this._mult_x,y*this._mult_y);
    }
  };
  function text_width(text){
    return this._ctx.measureText(text).width*this._fact_t;
  };
  function text_multiline(text,width,res){
    width /= this._fact_t;
    var ctx = this._ctx;
    var map = Object.create(null);
    var measure = function(str,d){
      if(!str)
        return 0;
      var r = map[str];
      if(r)
        return r;
      return (map[str] = ctx.measureText(str).width);
    };
    var b = 0, m = 0, n = text.length;
    var x,y,c,a,v,w;
    while(b<n){
      c = text.substring(b,n);
      w = measure(c);
      if(width>=w){
        if(w>m)
          m = w;
        res.push(c);
        break;
      }
      x = y = b+width/w*(n-b)|0;
      w = measure(text.substring(b,x));
      while(--x>b)
        if(text[x]===' '&&(!(y = x)||text[x-1]!==' '))
          if(width>=(w = measure(text.substring(b,x))))
            break;
      if(width<w||x<=b){
        while(--y>b)
          if(width>=(w = measure(c = text.substring(b,y))))
            break;
        if(y<=b){
          y = b+1;
          c = text[b];
          w = measure(c);
        }
        if(w>m)
          m = w;
        res.push(c);
        b = y;
        continue;
      }
      v = w;
      a = x;
      while(++x<n)
        if(text[x]===' ')
          if(width>=(w = measure(text.substring(b,x)))){
            v = w;
            a = x;
            continue;
          }else
            break;
      x = a;
      while(x>0 && text[x-1]===' ')
        x--;
      c = text.substring(b,x);
      if(x!==a)
        v = measure(c);
      if(v>m)
        m = v;
      b = a;
      while(b<n && text[b]===' ')
        b++;
      res.push(c);
    }
    map = null;
    return m;
  };
  return Canvas;
})();//Canvas

Global.Canvas = Canvas;

})();//KMCO_H5E_Canvas

//EOF