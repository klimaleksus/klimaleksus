// KMCO-H5E-Options.js

"use strict";

(function KMCO_H5E_Options(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;
  
/*
MENU
Continue game.
Restart level.
Options...
*/
/*
OPTIONS
Back to menu.
Video settings...
Input controls...
*/
/*
VIDEO
Back to options.
Resolution: 100%
Canvas smoothing: YES
FPS speed: 30 (33%)
*/
/*
INPUT
Back to options.
Movement: KEYBOARD
*/


var Options = (function Options(Options){
  var Textbox = Inherit.Parent('Textbox');
  var Button = Inherit.Parent('Button');
  var Padded = Inherit.Parent('Padded');
  var Strokable = Inherit.Parent('Strokable');
  var F = Private('$Options.F$');
  var S = Private('$Options.S$');
  var C = Private('$Options.C$');
  var D = Private('$Options.D$');
  var I = Private('$Options.I$');
  var R = Private('$Options.R$');
  var L = Private('$Options.L$');
  return Options = Inherit([Button,Padded],{
    array$: null,
    onmove$: null,
    [I]: -1,
    [F]: null,
    [S]: null,
    [C]: null,
    [R]: null,
    [L]: null,
    [D]: false,
    $new: function(canvas){
      Button.$new.call(this,canvas,null);
      if(!this[F])
        this[F] = Textbox.new(canvas,null);
      if(!this[S])
        this[S] = Textbox.new(canvas,null);
      if(!this[C])
        this[C] = Textbox.new(canvas,null);
      if(!this[R])
        this[R] = Strokable.new(canvas,null);
      if(!this[L])
        this[L] = Strokable.new(canvas,null);
      if(!this.array)
        this.array = [];
    },
    $delete: function(){
      Button.$delete.call(this);
      Padded.$delete.call(this);
      if(this.array)
        this.clear();
      this.array = null;
      if(this[F])
        this[F] = this[F].delete();
      if(this[S])
        this[S] = this[S].delete();
      if(this[C])
        this[C] = this[C].delete();
      if(this[R])
        this[R] = this[R].delete();
      if(this[L])
        this[L] = this[L].delete();
      this.onmove = null;
    },
    copy: function(options){
      Button.copy.call(this,options);
      Padded.copy.call(this,options);
      this[F].copy(options[F]);
      this[S].copy(options[S]);
      this[C].copy(options[C]);
      this[R].copy(options[R]);
      this[L].copy(options[L]);
      var n = options.array.length;
      this.clear();
      this.array = [];
      this.array.length = n;
      for(var i=0; i<n; i++){
        this.array[i] = {};
        Object.assign(this.array[i],options.array[i]);
        this.array[i].textbox = Textbox.new(this.canvas);
        this.array[i].textbox.copy(options.array[i].textbox);
        if(options.array[i].box_no)
          this.array[i].box_no.copy(options.array[i].box_no);
        if(options.array[i].box_capt)
          this.array[i].box_capt.copy(options.array[i].box_capt);
      }
      this.onmove = options.onmove;
      return this.dirty_();
    },
    font$get: function(){
      return this[F];
    },
    select$get: function(){
      return this[S];
    },
    caption$get: function(){
      return this[C];
    },
    range_right$get: function(){
      return this[R];
    },
    range_left$get: function(){
      return this[L];
    },
    current$get: function(){
      var idx = this[I];
      if(idx<0)
        return null;
      var val = this.array[idx];
      if(!val)
        return null;
      if(val){
        if(val.type==='question' && !val.curr)
          return val.box_no;
        return val.textbox || null;
      }
      return null;
    },
    commit: function(){
      if(this.clean_())
        array_calc.call(this);
      return this;
    },
    clear: function(){
      for(var i=0,a=this.array,n=a.length; i<n; i++){
        a[i].textbox = a[i].textbox.delete();
        if(a[i].box_no)
          a[i].box_no = a[i].box_no.delete();
        if(a[i].box_capt)
          a[i].box_capt = a[i].box_capt.delete();
      }
      this.array.length = 0;
    },
    add_caption: function(text){
      this.dirty_();
      return this.array.push({
        type: 'caption',
        text: text,
        textbox: Textbox.new(this.canvas),
      })-1;
    },
    add_button: function(text,onclick){
      this.dirty_();
      if(this[I]<0)
        this[I] = this.array.length;
      return this.array.push({
        type: 'button',
        text: text,
        textbox: Textbox.new(this.canvas),
        onclick: onclick,
      })-1;  
    },
    add_list: function(values,index,onchange,title){
      this.dirty_();
      if(this[I]<0)
        this[I] = this.array.length;
      return this.array.push({
        type: 'list',
        index: index,
        values: values,
        text: values[index],
        textbox: Textbox.new(this.canvas),
        onchange: onchange,
        title: title || '',
        box_capt: title ? Textbox.new(this.canvas) : null,
      })-1;  
    },
    add_range: function(value,maxtext,onchange,totext,title){
      this.dirty_();
      if(this[I]<0)
        this[I] = this.array.length;
      return this.array.push({
        type: 'range',
        value: value,
        text: totext ? totext(value) : ''+value,
        maxtext: maxtext,
        textbox: Textbox.new(this.canvas),
        onchange: onchange,
        totext: totext,
        title: title || '',
        box_capt: title ? Textbox.new(this.canvas) : null,
      })-1;
    },
    add_question: function(yes,no,defyes,onclick){
      this.dirty_();
      if(this[I]<0)
        this[I] = this.array.length;
      return this.array.push({
        type: 'question',
        text: yes,
        text_no: no,
        textbox: Textbox.new(this.canvas),
        box_no: Textbox.new(this.canvas),
        curr: !!defyes,
        onclick: onclick,
      })-1;
    },
    enter: function(){
      var idx = this.index;
      var old = idx;
      var arr = this.array;
      if(idx<0)
        return;
      var val = arr[idx];
      if(val.type==='button'){
        if(val.onclick)
          val.onclick();
        this.onmove && this.onmove(5);
        return 5;
      }else if(val.type==='question'){
        if(val.onclick)
          val.curr = !!val.onclick(val.curr);
        this.onmove && this.onmove(5);
        this.dirty_();
        return 5;
      }else if(val.type==='list'){
        if(val.onchange){
          var i = val.onchange(val.index,val.text,0);
          if(i!==val.index){
            val.index = i;
            val.text = val.values[val.index];
            this.dirty_();
          }
        }
      }else if(val.type==='range'){
        if(val.onchange)
          val.onchange(val.value,val.text,0);
      }
      return 0;
    },
    click: function(x,y){
      //if(this.clean_())
      //  array_calc.call(this);
      var arr = this.array;
      var len = arr.length;
      if(len<1)
        return 0;
      var idx = len;
      while(--idx>=0)
        if(arr[idx].textbox.y2<y){
          idx++;
          break;
        }
      var obj = arr[idx];
      if(idx<0 || idx>=len || obj.textbox.y1>y)
        return 0;
      var box = obj.textbox;
      var x1 = box.x1, x2 = box.x2;
      if(obj.type==='question'){
        if(x>=x1 && x<=x2){
          if(this[I]===idx && obj.curr)
            return this.enter();
          return this.left();
        }else if(x>=obj.box_no.x1 && x<=obj.box_no.x2){
          if(this[I]===idx && !obj.curr)
            return this.enter();
          return this.right();
        }
        return 0;
      }
      if(x1>x || x2<x){
        if(this[I]===idx && (obj.type==='list' || obj.type==='range')){
          if(x>obj.x2 && x<=obj.x2+box.size+box.pad_x)
            return this.right();
          if(x<obj.x1 && x>=obj.x1-(box.size+box.pad_x))
            return this.left();
        }
        if(!obj.title || x<obj.box_capt.x1 || x>obj.box_capt.x2)
          return 0;
      }
      if(this[I]===idx)
        return this.enter();
      if(obj.type==='caption')
        return 0;
      this[I] = idx;
      this.onmove && this.onmove(-1);
      this.dirty_();
      return -1;
    },
    down: function(){
      var idx = this.index;
      var old = idx;
      var arr = this.array;
      var len = arr.length;
      while(++idx<len)
        if(arr[idx].type!=='caption')
          break;
      if(idx===len)
        for(idx=0; idx<old; idx++)
          if(arr[idx].type!=='caption')
            break;
      this[I] = idx;
      if(idx!==old){
        this.onmove && this.onmove(2);
        this.dirty_();
        return 2;
      }
      return 0;
    },
    up: function(){
      var idx = this.index;
      var old = idx;
      var arr = this.array;
      var len = arr.length;
      while(--idx>=0)
        if(arr[idx].type!=='caption')
          break;
      if(idx<0)
        for(idx=len-1; idx>old; idx--)
          if(arr[idx].type!=='caption')
            break;
      this[I] = idx;
      if(idx!==old){
        this.onmove && this.onmove(8);
        this.dirty_();
        return 8;
      }
      return 0;
    },
    left: function(){
      var idx = this.index;
      if(idx<0)
        return;
      var v = this.array[idx];
      if(v.type==='list'){
        if(v.index<1)
          return 0;
        if(v.index<=0)
          v.index = v.values.length-1;
        else
          v.index--;          
        v.text = v.values[v.index];
        if(v.onchange)
          v.onchange(v.index,v.values,-1);
        this.onmove && this.onmove(4);
        this.dirty_();
        return 4;
      }else if(v.type==='range'){
        if(v.onchange){
          v.value = v.onchange(v.value,v.text,-1);
          v.text = v.totext ? v.totext(v.value) : ''+v.value;
        }
        this.onmove && this.onmove(4);
        this.dirty_();
        return 4;
      }else if(v.type==='question'){
        if(!v.curr){
          v.curr = true;
          this.onmove && this.onmove(7);
          this.dirty_();
          return 7;
        }
      }
      return 0;
    },
    right: function(){ // refucktor
      var idx = this.index;
      if(idx<0)
        return;
      var v = this.array[idx];
      if(v.type==='list'){
        if(v.index>=v.values.length-1)
          return 0;
        if(v.index>=v.values.length-1)
          v.index = 0;
        else
          v.index++;
        v.text = v.values[v.index];
        if(v.onchange)
          v.onchange(v.index,v.values,1);
        this.onmove && this.onmove(6);
        this.dirty_();
        return 6;
      }else if(v.type==='range'){
        if(v.onchange){
          v.value = v.onchange(v.value,v.text,1);
          v.text = v.totext ? v.totext(v.value) : ''+v.value;
        }
        this.onmove && this.onmove(6);
        this.dirty_();
        return 6;
      }else if(v.type==='question'){
        if(v.curr){
          v.curr = false;
          this.onmove && this.onmove(9);
          this.dirty_();
          return 9;
        }
      }
      return 0;
    },
    index$get: function(){
      return this[I];
    },
    index$set: function(v){
      if(v<0 || v>=this.array.length)
        v = -1;
      this[I] = v;
      this.dirty_();
    },
    draw: function(){
      if(this.clean_())
        array_calc.call(this);
      var canvas = this.canvas;
      Button.draw.call(this);
      for(var i=0,a=this.array,n=a.length; i<n; i++){
        var v = a[i];
        var t = v.textbox;
        t.draw();
        if(v.title){
          v.box_capt.draw();
        }
        if(this[I]===i && (v.type==='list'||v.type==='range')){
          if(v.type==='range' || v.type==='list'/*&&v.index>0*/){
            this[L].draw();
            canvas.draw_tria(v.x1,v.cy,-t.size);
          }
          if(v.type==='range' || v.type==='list'/*&&v.index<v.values.length-1*/){
            this[R].draw();
            canvas.draw_tria(v.x2,v.cy,t.size);
          }
        }else if(v.type==='question')
          v.box_no.draw();
      }
      //canvas.draw_alpha(1);
    },
  },'Options');
  function array_calc(){
    var a = this.array;
    var n = a.length;
    var v,t,m;
    var index = this.index;
    for(var i=0; i<n; i++){
      v = a[i];
      t = v.textbox;
      if(v.type==='caption')
        t.copy(this[C]);
      else if(i===index)
        t.copy(this[S]);
      else
        t.copy(this[F]);
      if(v.type==='question'){
        v.box_no.copy(t);
        if(v.curr)
          v.box_no.copy(this[F]);
        else
          t.copy(this[F]);
      }
      if(v.title){
        v.box_capt.copy(this[C]);
        v.box_capt.text = v.title;
      }
      //t.align = 8;
      if(v.type==='list'){
        t.text = v.values.join('\n');
        t.multiline = -1;
      }else if(v.type==='range'){
        t.text = v.maxtext;
        t.multiline = -1;
      }else if(v.type==='question'){
        t.text = v.text;
        v.box_no.text = v.text_no;
      }else
        t.text = v.text;
    }
    var h = this.pad_y*2, w = 0;
    //var px = this.pad_x, py = this.pad_y;
    for(var i=0; i<n; i++){
      v = a[i];
      t = v.textbox;
      //t.pad(px,py);
      h += t.height;
      //if(i)
      //  h -= py;
      if(v.type==='list' || v.type==='range'){
        m = t.width+(t.size+t.pad_x)*2;
        if(v.title)
          m += v.box_capt.width+v.box_capt.pad_x;
      }else if(v.type==='question')
        m = t.width+v.box_no.width+t.pad_x+v.box_no.pad_x;
      else
        m = t.width;
      if(m>w)
        w = m;
    }
    var x = this.cx, y = this.y1+this.pad_y;
    for(var i=0; i<n; i++){
      var v = a[i];
      t = v.textbox;
      if(v.type==='question'){
        v.box_no.xy(x+v.box_no.pad_x,y,7);
        t.xy(x-t.pad_x,y,9);
      }else{
        t.xy(x,y,8);
      }
      y = y+t.height;
    }
    for(var i=0; i<n; i++){
      v = a[i];
      t = v.textbox;
      if(v.type==='list' || v.type==='range'){
        if(v.title){
          v.box_capt.xy(x-(t.width+(t.size+t.pad_x)*2)/2,t.y1,8);
          t.xy(x+(v.box_capt.width+v.box_capt.pad_x)/2,t.y1,8);
        }
        v.x2 = t.x2;
        v.x1 = t.x1;
        v.cy = (t.y1+t.y2)/2;
        t.text = v.text;
        t.multiline = 0;
      }
    }
    w += this.pad_x*2;
    this.dim(w,h);
  };
})();//Options

Global.Options = Options; 

})();//KMCO_H5E_Options

//EOF