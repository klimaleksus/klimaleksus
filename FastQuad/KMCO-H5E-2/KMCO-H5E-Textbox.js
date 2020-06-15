// KMCO-H5E-Textbox.js v1.0

"use strict";

(function KMCO_H5E_Textbox(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

var Inherit = Global.Inherit;

var Textbox = (function Textbox(Textbox){
  var Private = Inherit.Private;
  var align = Private('$Textbox.align$');
  var text = Private('$Textbox.text$');
  var size = Private('$Textbox.size$');
  var width = Private('$Textbox.width$');
  var canvas = Private('$Textbox.canvas$');
  var multiline = Private('$Textbox.multiline$');
  var strings = Private('$Textbox.strings$');
  var Color = Inherit.Color;
  var fix_x = [0,
    1,0,-1,
    1,0,-1,
    1,0,-1,
  ];
  var fix_y = [0,
    -1,-1,-1,
    0,0,0,
    1,1,1,
  ];
  var move_x = [0,
    0,0.5,1,
    0,0.5,1,
    0,0.5,1,
  ];
  var move_y = [0,
    1,1,1,
    0.5,0.5,0.5,
    0,0,0,
  ];
  return Textbox = Inherit(Inherit.Base,{
    x$: 0,
    y$: 0,
    pad_x$: 0,
    pad_y$: 0,
    line$: 0,
    visible$: true,
    disabled$: false,
    fill$: null,
    stroke$: null,
    [align]: 5,
    [text]: '',
    [size]: 0,
    [width]: -1,
    [canvas]: null,
    [multiline]: 0,
    [strings]: null,
    $new: function(Canvas){
      if(!Canvas)
        throw new Error('Textbox.new(Canvas)');
      Base.$new.call(this);
      this.fill = Color.new();
      this.stroke = Color.new();
      this[canvas] = Canvas;
    },
    $delete: function(){
      Base.$delete.call(this);
    },
    copy: function(){
      //return Textbox.new().xy(this.x,this.y);
    },
    pad: function(x,y){
      this.pad_x = x;
      this.pad_y = y;
      return this;
    },
    xy: function(x,y,align){
      this.x = x;
      this.y = y;
      if(align)
        this.align = align;
      return this;
    },
    draw: function(){
      if(!this.visible)
        return this;
      var Canvas = this[canvas];
      Canvas.draw_color(this.stroke.css,this.fill.css);
      Canvas.draw_font(this[size],this.line);
      var a = this[align];
      if(!this[multiline])
        Canvas.draw_text(this.x+fix_x[a]*this.pad_x,this.y+fix_y[a]*this.pad_y,a,this.text);
      else{
        var t = this[strings];
        if(!t){
          calc_width(this);
          t = this[strings];          
        }
        var x = this.x+fix_x[a]*this.pad_x;
        var y = this.y+fix_y[a]*this.pad_y;
        for(var i=0,n=t.length; i<n; i++){
          if(t[i])
            Canvas.draw_text(x,y,a,t[i]);
          y += this.size;
        }
      }
      return this;
    },
    click: function(x,y){
      if(this.disabled)
        return false;
      //
    },
    show: function(enabled){
      this.visible = !!enabled;
      this.disabled = !enabled;
      return this;
    },
    align$get: function(){
      return this[align];
    },
    align$set: function(v){
      this[align] = v;
      //
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
    },
    width$get: function(){
      var w = this[width];
      if(w<0)
        w = calc_width(this);
      return this.pad_x*2+w;
    },
    height$get: function(){
      return this.pad_y*2+this[size];
    },
    x1$get: function(){
      return this.x-move_x[this[align]]*this.width;
    },
    x2$get: function(){
      return this.x+(1-move_x[this[align]])*this.width;
    },
    y1$get: function(){
      return this.y-move_y[this[align]]*this.height;
    },
    y2$get: function(){
      return this.y+(1-move_y[this[align]])*this.height;
    },
  },'Textbox');
  function calc_width(o){
    if(!o[text] || o[size]<=0)
      return o[width] = 0;
    var Canvas = o[canvas];
    Canvas.draw_font(o[size]);
    var mult = o[multiline];
    if(!mult)
      return (o[width] = Canvas.text_width(o[text]));
    var a = o.text.split('\n');
    var s = a;
    var m = 0, w;
    if(mult<0){
      for(var i=0,n=a.length; i<n; i++){
        w = Canvas.text_width(a[i]);
        if(w>m)
          m = w;
      }
    }else{
      s = [];
      for(var i=0,n=a.length; i<n; i++){
        w = Canvas.text_multiline(a[i],mult,s);
        if(w>m)
          m = w;
      }
    }
    o[strings] = s;
    o[width] = m;
    return m;
  };
  return Textbox;
})();//Textbox

Global.Textbox = Textbox; 

})();//KMCO_H5E_Textbox

//EOF