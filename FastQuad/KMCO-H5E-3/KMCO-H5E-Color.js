// KMCO-H5E-Color.js v1.0

"use strict";

(function KMCO_H5E_Color(){

var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Color = (function Color(Color){
  var Dirty = Inherit.Parent('Dirty');
  var R = Private('$Color.R$');
  var G = Private('$Color.G$');
  var B = Private('$Color.B$');
  var H = Private('$Color.H$');
  var S = Private('$Color.S$');
  var L = Private('$Color.L$');
  var C = Private('$Color.C$');
  var T = Private('$Color.T$');
  var A = Private('$Color.A$');
  var map = [];
  map.length = 256;
  for(var i=0; i<256; i++)
    map[i] = ('0'+i.toString(16)).substr(-2);
  return Color = Inherit(Dirty,{
    [L]: 0.0,
    [S]: 0.0,
    [H]: 0.0,
    [B]: 0.0,
    [G]: 0.0,
    [R]: 0.0,
    [C]: 0,
    [T]: '',
    [A]: 1.0,
    $new: function(delegate){
      Dirty.$new.call(this,delegate);
    },
    $delete: function(){
      Dirty.$delete.call(this);
    },
    copy: function(color){
      if(color[C]>=0){
        this[R] = color[R];
        this[G] = color[G];
        this[B] = color[B];
      }
      if(color[C]<=0){
        this[H] = color[H];
        this[S] = color[S];
        this[L] = color[L];
      }
      this[C] = color[C]|0;
      this[T] = color[T]||'';
      this[A] = color[A];
      return Dirty.copy.call(this,color);
    },
    rgb: function(r,g,b){
      if(this[C]>=0
      && this[R]===r
      && this[G]===g
      && this[B]===b)
        return this;
      this[C] = 1;
      this[R] = r;
      this[G] = g;
      this[B] = b;
      this[T] = '';
      return this.dirty_();
    },
    hsl: function(h,s,l){
      h -= Math.floor(h);
      if(this[C]<=0
      && this[H]===h
      && this[S]===s
      && this[L]===l)
        return this;
      this[C] = -1;
      this[H] = h;
      this[S] = s;
      this[L] = l;
      this[T] = '';
      return  this.dirty_();
    },
    rgba: function(r,g,b,a){
      if(this[C]>=0
      && this[R]===r
      && this[G]===g
      && this[B]===b
      && this[A]===a)
        return this;
      this[C] = 1;
      this[R] = r;
      this[G] = g;
      this[B] = b;
      this[A] = A;
      this[T] = '';
      return this.dirty_();
    },
    hsla: function(h,s,l,a){
      h -= Math.floor(h);
      if(this[C]<=0
      && this[H]===h
      && this[S]===s
      && this[L]===l
      && this[A]===a)
        return this;
      this[C] = -1;
      this[H] = h;
      this[S] = s;
      this[L] = l;
      this[A] = A;
      this[T] = '';
      return  this.dirty_();
    },
    gray: function(v){
      if(this[C]>=0
      && this[R]===v
      && this[G]===v
      && this[B]===v)
        return this;
      this[C] = 1;
      this[R] = v;
      this[G] = v;
      this[B] = v;
      this[T] = '';
      return this.dirty_();
    },
    graya: function(v,a){
      if(this[C]>=0
      && this[R]===v
      && this[G]===v
      && this[B]===v
      && this[A]===a)
        return this;
      this[C] = 1;
      this[R] = v;
      this[G] = v;
      this[B] = v;
      this[A] = a;
      this[T] = '';
      return this.dirty_();
    },
    css$get: rgb2css,
    toString: rgb2css,
    r$get: function(){
      if(this[C]<0)
        hsl2rgb(this);
      return this[R];
    },
    r$set: function(v){
      if(this[C]>=0 && v===this[R])
        return;
      this[C] = 1;
      this[T] = '';
      this[R] = v;
      this.dirty_();
    },
    g$get: function(){
      if(this[C]<0)
        hsl2rgb(this);
      return this[G];
    },
    g$set: function(v){
      if(this[C]>=0 && v===this[G])
        return;
      this[C] = 1;
      this[T] = '';
      this[G] = v;
      this.dirty_();
    },
    b$get: function(){
      if(this[C]<0)
        hsl2rgb(this);
      return this[B];
    },
    b$set: function(v){
      if(this[C]>=0 && v===this[B])
        return;
      this[C] = 1;
      this[T] = '';
      this[B] = v;
      this.dirty_();
    },
    h$get: function(){
      if(this[C]>0)
        rgb2hsl(this);
      return this[H];
    },
    h$set: function(v){
      v -= Math.floor(v);
      if(this[C]<=0 && v===this[H])
        return;
      this[C] = -1;
      this[H] = v;
      this.dirty_();
    },
    s$get: function(){
      if(this[C]>0)
        rgb2hsl(this);
      return this[S];
    },
    s$set: function(v){
      if(this[C]<=0 && v===this[S])
        return;
      this[C] = -1;
      this[S] = v;
      this.dirty_();
    },
    l$get: function(){
      if(this[C]>0)
        rgb2hsl(this);
      return this[L];
    },
    l$set: function(v){
      if(this[C]<=0 && v===this[L])
        return;
      this[C] = -1;
      this[L] = v;
      this.dirty_();
    },
    a$get: function(){
      return this[A];
    },
    a$set: function(v){
      //if(v<=0)
      //  this[A] = 0.0;
      //else if(v>=1)
      //  this[A] = 1.0;
      //else
      //  this[A] = v;
      if(v===this[A])
        return;
      this[A] = v;
      this[T] = '';
      this.dirty_();
    },
  },'Color');
  function rgb2hsl(o){
    o[C] = 0;
    var r = o[R], g = o[G], b = o[B];
    var m = Math.max(r,g,b), n = Math.min(r,g,b);
    var h, s, l = (m + n) / 2;
    if(m===n)
      h = s = 0;
    else{
      var d = m-n;
      s = l>0.5 ? d/(2-m-n) : d/(m+n);
      switch(max){
        case r: h = (g-b)/d + (g<b ? 6 : 0); break;
        case g: h = (b-r)/d + 2; break;
        case b: h = (r-g)/d + 4; break;
      }
      h /= 6;
    }
    o[H] = h;
    o[S] = s;
    o[L] = l;
  };
  function hsl2rgb(o){
    o[C] = 0;
    o[T] = '';
    var h = o[H], s = o[S], l = o[L];
    var r, g, b;
    if(!s)
      r = g = b = l;
    else{
      var q = l<0.5 ? l*(1+s) : l+s-l*s;
      var p = 2*l-q;
      r = hue2rgb(p,q,h+1/3);
      g = hue2rgb(p,q,h);
      b = hue2rgb(p,q,h-1/3);
    }
    o[R] = r;
    o[G] = g;
    o[B] = b;
  };
  function hue2rgb(p,q,t){
    if(t<0)
      t += 1;
    if(t>1)
      t -= 1;
    if(t<1/6)
      return p+(q-p)*6*t;
    if(t<1/2)
      return q;
    if(t<2/3)
      return p+(q-p)*(2/3-t)*6;
    return p;
  };
  function rgb2css(){
    if(this[A]<=0)
      return '';
    if(this[C]<0)
      hsl2rgb(this);
    else if(this[T])
      return this[T];
    var r = this[R]*255+.5|0;
    var g = this[G]*255+.5|0;
    var b = this[B]*255+.5|0;
    r = r>255 ? 255 : (r<0 ? 0 : r);
    g = g>255 ? 255 : (g<0 ? 0 : g);
    b = b>255 ? 255 : (b<0 ? 0 : b);
    var m = map;
    if(this[A]>=1)
      return (this[T] = '#'+m[r]+m[g]+m[b]);
    return (this[T] = 'rgba('+r+','+g+','+b+','+this[A]+')');
  };
})();//Color

Global.Color = Color;

})();//KMCO_H5E_Color

//EOF