// KMCO-H5E-Textbox.js v1.0

"use strict";

(function KMCO_H5E_Textbox(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var DEBUG_DRAW = false;

var Textbox = (function Textbox(Textbox){
  //var Base = Inherit.Base;
  var Color = Inherit.Parent('Color');
  var Padded = Inherit.Parent('Padded');
  var Strokable = Inherit.Parent('Strokable');
  var text = Private('$Textbox.text$');
  var size = Private('$Textbox.size$');
  var width = Private('$Textbox.width$');
  var multiline = Private('$Textbox.multiline$');
  var strings = Private('$Textbox.strings$');
  var shft_x = [0,
    1,0,-1,
    1,0,-1,
    1,0,-1,
  ];
  var shft_y = [0,
    -1,-1,-1,
    0,0,0,
    1,1,1,
  ];
  var move_x = [0.0,
    0.0,0.5,1.0,
    0.0,0.5,1.0,
    0.0,0.5,1.0,
  ];
  var move_y = [0.0,
    1.0,1.0,1.0,
    0.5,0.5,0.5,
    0.0,0.0,0.0,
  ];
  return Textbox = Inherit([Padded,Strokable],{
    x$: 0,
    y$: 0,
    align$: 0,
    [text]: '',
    [size]: 0,
    [width]: -1,
    [multiline]: 0,
    [strings]: null,
    $new: function(canvas,delegate){
      Padded.$new.call(this,delegate);
      Strokable.$new.call(this,canvas,delegate);
    },
    $delete: function(){
      Padded.$delete.call(this);
      Strokable.$delete.call(this);
      this[strings] = null;
    },
    copy: function(textbox){
      Strokable.copy.call(this,textbox);
      this.x = textbox.x;
      this.y = textbox.y;
      this.align = textbox.align;
      this[text] = textbox[text];
      this[size] = textbox[size];
      this[width] = textbox[width];
      this[multiline] = textbox[multiline];
      this[strings] = textbox[strings];      
      return Padded.copy.call(this,textbox);
    },
    xy: function(x,y,align){
      this.x = x;
      this.y = y;
      if(align)
        this.align = align;
      return this;
    },
    draw: function(){
      var canvas = this.canvas;
      Strokable.draw.call(this);
      canvas.draw_font(this[size]);
      var a = this.align;
      if(!this[multiline])
        canvas.draw_text(this.x+shft_x[a]*this.pad_x+this.fix_x,this.y+shft_y[a]*this.pad_y+this.fix_y,a,this[text]);
      else{
        var t = this[strings];
        if(!t){
          calc_width.call(this);
          t = this[strings];          
        }
        var x = this.x+shft_x[a]*this.pad_x+this.fix_x;
        var y = this.y+shft_y[a]*this.pad_y+this.fix_y;
        for(var i=0,n=t.length; i<n; i++){
          if(t[i])
            canvas.draw_text(x,y,a,t[i]);
          y += this.size;
        }
      }
      if(DEBUG_DRAW){
        canvas.draw_alpha(0.75);
        canvas.draw_color('#f00','',2);
        canvas.draw_rect(this.x1,this.y1,this.width,this.height);
        canvas.draw_color('#0f0','',2);
        canvas.draw_rect(this.x1+this.pad_x,this.y1+this.pad_y,this.width-this.pad_x*2,this.height-this.pad_y*2);
        canvas.draw_color('#00f','',2);
        canvas.draw_cross(this.x,this.y,5);
        canvas.draw_cross(this.x+this.fix_x,this.y+this.fix_y,3);
        canvas.draw_alpha(1);
      }
      return this;
    },
    text$get: function(){
      return this[text];
    },
    text$set: function(v){
      if(this[text]===v)
        return;
      this[width] = -1;
      this[text] = v;
      this[strings] = null;
      this.dirty_();
    },
    multiline$get: function(){
      return this[multiline];
    },
    multiline$set: function(v){
      if(this[multiline]===v)
        return;
      this[multiline] = v;
      this[width] = -1;
      this[strings] = null;
      this.dirty_();
    },
    size$get: function(){
      return this[size];
    },
    size$set: function(v){
      if(this[size]===v)
        return;
      this[width] = -1;
      this[size] = v;
      this[strings] = null;
      this.dirty_();
    },
    width$get: function(){
      var w = this[width];
      if(w<0)
        w = calc_width.call(this);
      return this.pad_x*2+w;
    },
    height$get: function(){
      return this.pad_y*2+this[size];
    },
    x1$get: function(){
      return this.x-move_x[this.align]*this.width;
    },
    x2$get: function(){
      return this.x+(1-move_x[this.align])*this.width;
    },
    y1$get: function(){
      return this.y-move_y[this.align]*this.height;
    },
    y2$get: function(){
      return this.y+(1-move_y[this.align])*this.height;
    },
  },'Textbox');
  function calc_width(){
    if(!this[text] || this[size]<=0)
      return this[width] = 0;
    var canvas = this.canvas;
    canvas.draw_font(this[size]);
    var mult = this[multiline];
    if(!mult)
      return (this[width] = canvas.text_width(this[text]));
    var a = this.text.split('\n');
    var s = a;
    var m = 0, w;
    if(mult<0){
      for(var i=0,n=a.length; i<n; i++){
        w = canvas.text_width(a[i]);
        if(w>m)
          m = w;
      }
    }else{
      s = [];
      for(var i=0,n=a.length; i<n; i++){
        w = canvas.text_multiline(a[i],mult,s);
        if(w>m)
          m = w;
      }
    }
    this[strings] = s;
    this[width] = m;
    return m;
  };
  return Textbox;
})();//Textbox

Global.Textbox = Textbox; 

})();//KMCO_H5E_Textbox

//EOF