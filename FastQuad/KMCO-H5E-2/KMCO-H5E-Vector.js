// KMCO-H5E-Vector.js

"use strict";

function Private(name){
  return Symbol(name);
  //if(!Private.mycnt)
  //  Private.mycnt = 0;
  //return name+'/'+(++Private.mycnt);
};

function Inherit(parents,obj,classname){
  if(!obj){
    obj = parents;
    parents = null;
    classname = '';
  }
  if(!parents)
    parents = [Object.create(null),obj];
  else if(!Array.isArray(parents)){
    if(!parents[''])
      throw console.error(parents),new Error('Inherit: wrong proto parent');
    parents = [Object.create(null),parents[''],obj];
  }else
    parents = [Object.create(null)].concat(parents.map(function(parent){
      if(!parent[''])
        throw new Error('Inherit: wrong proto parents');
      return parent[''];
    }),obj);
  obj = Object.assign.apply(Object,parents);
  var res = Object.create(null);
  for(var key in obj){
    var put = key.substring(key.length-4);
    if(put==='$get' || put==='$set'){
      var name = key.substring(0,key.length-4);
      if(!res[name])
        res[name] = {
          configurable: false,
          enumerable: true,
        };
      res[name][put==='$get'?'get':'set'] = obj[key];
    }else{
      res[key] = {
        configurable: false,
        enumerable: true,
        writable: false,
        value: obj[key],
      };
    }
  }
  res[''] = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: obj,
  };
  res['$'] = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: classname ? Private(classname) : null,
  };
  obj = Object.create(null);
  /*
  if(!res.new)
    res.new = {
      configurable: false,
      enumerable: true,
      writable: false,
      value: function(){
        const me = Object.create(obj);
        obj.$new.apply(me,arguments);
        return me;
      },
    };
    */
  Object.defineProperties(obj,res);
  Object.preventExtensions(obj);
  if(classname)
    Inherit[classname] = obj;
  return obj;
};

Inherit.Private = Private;

var Base = (function(){
  var recycle = Object.create(null);
  var cache = 100;
  var hOP = Object.prototype.hasOwnProperty;
  return Inherit({
    new: function(){
      if(!hOP.call(this,''))
        throw new Error('Inherit: called .new on object instead of prototype');
      var S = this.$;
      var me;
      if(S && recycle[S] && recycle[S].length)
        me = recycle[S].pop();
      else
        me = Object.create(this);
      this.$new.apply(me,arguments);
      Object.preventExtensions(me);
      return me;
    },
    delete: function(){
      this.$delete();
      var S = this.$;
      //console.log(S);
      if(S){
        //console.log(recycle[S]&&recycle[S].length)
        if(!recycle[S])
          recycle[S] = [this];
        else if(recycle[S].length<cache)
          recycle[S].push(this);
      }
      return null;
    },
    $new: function(){},
    $delete: function(){},
  });
})();

//

/*
var Test = (function(){
  var P = Private('$Test.P');
  function p(me){
    me[P] = 0;
  };
  return Inherit(Base,{
    $new: function(v){
      Parent.$new.call(this,v);
      this[P] = v;
    },
    f$get: function(){
      return this[P];
    },
    f$set: function(v){
      return this[P] = v;
    },
  });
})();

/*
function Inherit_(protos,props){
  var arr = [Object.create(null)];
  if(protos){
    if(Array.isArray(protos))
      for(var i=0,n=protos.length; i<n; i++)
        arr.push(protos[i]._Ptoto);
    else
      arr.push(protos._Ptoto);
  }
  var res;
  arr.push(obj,{
    new: function(){
      const me = Object.create(res);
      res._Init.apply(me,arguments);
      return me;
    }
  });
  res = Object.assign.apply(Object,arr);
  if(props){
    for(var name in props){
      props[name].configurable = true;
      props[name].enumerable = true;
    }
    if(!res._Props)
      res._Props = Object.create(null);
    Object.assign(res._Props,props);
    //Object.defineProperties(res,props);
  }
  return res;
};
*/


var sqrt = Math.sqrt;
var atan2 = Math.atan2;
var sin = Math.sin;
var cos = Math.cos;


/**
  Vector:
  .x, .y, - coords, .xy(x,y) - chain
  .len, .dir - polar, .lendir(len,dir) - chain
  .add(vector), .sub(vector) - vector math
**/

var Vector = (function(t){
  var X = Private('$Vector.X');
  var Y = Private('$Vector.Y');
  var L = Private('$Vector.L');
  var D = Private('$Vector.D');
  var T = Private('$Vector.T');
  function p2d(me){
    me[T] = 0;
    var len = me[L];
    var dir = me[D];
    me[X] = cos(dir)*len;
    me[Y] = sin(dir)*len;
  };
  function d2p(me){
    me[T] = 0;
    var x = me[X];
    var y = me[Y];
    me[L] = sqrt(x*x+y*y);
    me[D] = atan2(y,x);
  };
  return Inherit(Base,{
    $new: function(){
      Base.$new.call(this);
      this[X] = this[Y] = this[L] = this[D] = this[T] = 0;
    },
    $delete: function(){
      Base.$delete.call(this);
    },
    copy: function(){
      return Vector.new().xy(this.x,this.y);
    },
    add: function(vector){
      this.x += vector.x;
      this.y += vector.y;
      return this;
    },
    sub: function(vector){
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    },
    mul: function(num){
      if(this[T]>=0){
        this[X] *= num;
        this[Y] *= num;
        this[T] = 1;
      }else
        this[D] *= num;
      return this;
    },
    xy: function(x,y){
      this[X] = x;
      this[Y] = y;
      this[T] = 1;
      return this;
    },
    lendir: function(len,dir){
      this[L] = len;
      this[D] = dir;
      this[T] = -1;
      return this;
    },
    x$get: function(){
      if(this[T]<0)
        p2d(this);
      return this[X];
    },
    x$set: function(v){
      if(this[T]<0)
        p2d(this);
      if(this[X]===v)
        return;
      this[X] = v;
      this[T] = 1;
    },
    y$get: function(){
      if(this[T]<0)
        p2d(this);
      return this[Y];
    },
    y$set: function(v){
      if(this[T]<0)
        p2d(this);
      if(this[Y]===v)
        return;
      this[Y] = v;
      this[T] = 1;
    },
    len$get: function(){
      if(this[T]>0)
        d2p(this);
      return this[L];
    },
    len$set: function(v){
      if(this[T]>0)
        d2p(this);
      if(this[L]===v)
        return;
      this[L] = v;
      this[T] = -1;
    },
    dir$get: function(){
      if(this[T]>0)
        d2p(this);
      return this[D];
    },
    dir$set: function(v){
      if(this[T]>0)
        d2p(this);
      if(this[D]===v)
        return;
      this[D] = v;
      this[T] = -1;
    },
    type: 'v',
  },'Vector');
})();


/**
  Circle: (Vector)
  .xyr(x,y,r) - chain
  .r - radius
  .rr = squared radius
**/

var Circle = (function(){
  var R0 = Private('$Circle.R0');
  var R1 = Private('$Circle.R1');
  var R2 = Private('$Circle.R2');
  return Inherit(Vector,{
    $new: function(){
      Vector.$new.call(this);
      this[R1] = this[R2] = this[R0] = 0;
    },
    $delete: function(){
      Vector.$delete.call(this);
    },
    copy: function(){
      return Circle.new().xyr(this.x,this.y,this.r);
    },
    xyr: function(x,y,r){
      this.xy(x||0,y||0);
      this[R1] = r||0;
      this[R2] = 0;
      this[R0] = r ? 1 : 0;
      return this;
    },
    r$get: function(){
      if(this[R0]<0){
        this[R0] = 0;
        return (this[R1] = sqrt(this[R2]));
      }
      return this[R1];
    },
    r$set: function(v){
      if(this[R0]<0 || this[R1]!==v){
        this[R0] = 1;
        this[R1] = v;
      }
    },
    rr$get: function(){
      if(this[R0]>0){
        this[R0] = 0;
        return (this[R2] = this[R1]*this[R1]);
      }
      return this[R2];
    },
    rr$set: function(v){
      if(this[R0]>0 || this[R2]!==v){
        this[R0] = -1;
        this[R2] = v;
      }
    },
    type: 'c',
  },'Circle');
})();


/**
  Square: (Circle)
  .x1, .x2, .y1, .y2 - getters for corners
  .ltw2(x1,y1,w2) - chain
  .h, .w == .r
  .r2, .w2, .h2 - getters for .r*2
**/

var Square = (function(){
  return Inherit(Circle,{
    $new: function(){
      Circle.$new.call(this);
    },
    $delete: function(){
      Circle.$delete.call(this);
    },
    copy: function(){
      return Square.new().xyr(this.x,this.y,this.r);
    },
    ltw2: function(x1,y1,w2){
      var r = w2/2;
      return this.xyr(x1+r,y1+r,r);
    },
    x1$get: function(){
      return this.x-this.r;
    },
    x2$get: function(){
      return this.x+this.r;
    },
    y1$get: function(){
      return this.y-this.r;
    },
    y2$get: function(){
      return this.y*2;
    },
    r2$get: function(){
      return this.r*2;
    },
    w$get: function(){
      return this.r;
    },
    h$get: function(){
      return this.r;
    },
    w2$get: function(){
      return this.r*2;
    },
    h2$get: function(){
      return this.r*2;
    },
    type: 's',
  },'Square');
})();


/**
  Ellipse: (Vector)
  .w, .h, .a - width, height, angle
  .xy(x,y), .wh(w,h), .wha(w,h,a), .xywh(x,y,w,h), .xywha(x,y,w,h,a), .xya(x,y,a)
**/

var Ellipse = (function(){
  var S = Private('Ellipse.$S');
  var A = Private('Ellipse.$A');
  return Inherit(Vector,{
    $new: function(){
      Vector.$new.call(this);
      this[S] = Vector.new();
      this[A] = Vector.new();
      this[A].len = 1;
    },
    $delete: function(){
      Vector.$delete.call(this);
      this[S] = this[S].delete();
      this[A] = this[A].delete();
    },
    copy: function(){
      return Ellipse.new().xywha(this.x,this.y,this.w,this.h,this.a);
    },
    IntersectCircle: function(x,y,r){
      var px = x-this.x;
      var py = y-this.y;
      var dx = this[A].x;
      var dy = this[A].y;
      var tx = (dx*px-dy*py)/(this[S].x+r);
      var ty = (dy*px+dx*py)/(this[S].y+r);
      return tx*tx+ty*ty<1;
    },
    wh: function(w,h){
      this[S].xy(w,h);
      return this;
    },
    wha: function(w,h,a){
      this[S].xy(w,h);
      this[A].dir = a;
      return this;
    },
    xywh: function(x,y,w,h){
      this.xy(x,y);
      this[S].xy(w,h);
      return this;
    },
    xywha: function(x,y,w,h,a){
      this.xy(x,y);
      this[S].xy(w,h);
      this[A].dir = a;
      return this;
    },
    xya: function(x,y,a){
      this.xy(x,y);
      this[A].dir = a;
      return this;
    },
    a$get: function(){
      return this[A].dir;
    },
    a$set: function(v){
      this[A].dir = v;
    },
    w$get: function(){
      return this[S].x;
    },
    w$set: function(v){
      this[S].x = v;
    },
    h$get: function(){
      return this[S].y;
    },
    h$set: function(v){
      this[S].y = v;
    },
    type: 'e',
  },'Ellipse');
})();


/**
  Rectangle: (Ellipse)
  .x1, .x2, .y1, .y2 - getters for corners
  .w2, .h2 - getters for .w*2 and .h*2
  .ltrd(x1,y1,x2,y2), .ltwh(x1,y1,w2,h2) - setters
**/
/*
var Rectangle00 = (function(){
  return Inherit(Ellipse,{
    $new: function(){
      Ellipse.$new.call(this);
    },
    $delete: function(){
      Ellipse.$delete.call(this);
    },
    copy: function(){
      return Rectangle.new().xywh(this.x,this.y,this.w,this.h);
    },
    ltrd: function(x1,y1,x2,y2){
      var w = (x2-x1)/2;
      var h = (y2-y1)/2;
      this.xywh(x1+w,y1+h,w,h);
      return this;
    },
    ltwh: function(x1,y1,w2,h2){
      var w = w2/2;
      var h = h2/2;
      this.xyhw(x1+w,y1+h,w,h);
      return this;
    },
    x1$get: function(){
      return this.x-this.w;
    },
    x2$get: function(){
      return this.x+this.w;
    },
    y1$get: function(){
      return this.y-this.h;
    },
    y2$get: function(){
      return this.y+this.h;
    },
    w2$get: function(){
      return this.w*2;
    },
    h2$get: function(){
      return this.h*2;
    },
    type: 'r',
  },'Rectangle00');
})();
*/

/**
  Intersect
**/

var max = Math.max;

var Intersect = (function(){
  var map = {
    'vv': function(a,b){
      var x = a.x-b.x;
      var y = a.y-b.y;
      return x*x+y*y < 0.0000001;
    },
    'vc': function(v,c){
      var x = c.x-v.x;
      var y = c.y-v.y;
      return x*x+y*y < c.rr;
    },
    'cc': function(a,b){
      var x = a.x-b.x;
      var y = a.y-b.y;
      var r = a.r+b.r;
      return x*x+y*y < r*r;
    },
    'vr': function(v,r){
      var x = v.x;
      var y = v.y;
      return (r.x1<x && r.y1<y && x<r.x2 && y<r.y2);
    },
    'cr': function(c,r){
      var x = c.x;
      var y = c.y;
      var r = c.r;
      var x1,y1,x2,y2;
      if((x1=r.x1-x)>=r || (y1=r.y1-r)>=r || (x2=x-r.x2)>=r || (y2=y-r.y2)>=r)
        return false;
      if((x2>x1?(x1=x2):x1)<0 || (y2>y1?(y1=y2):y1)<0)
        return true;
      return x1*x1+y1*y1<c.rr;      
    },
    'rr': function(a,b){
      return (a.x2>b.x1 && a.y2>b.y1 && b.x2>a.x1 && b.y2>a.y1);
    },
    'ce': function(c,e){
      return e.IntersectCircle(c.x,c.y,c.r);
    }
  };
  for(var key in map){
    var s = key.replace(/r/g,'s');
    if(key!=s)
      map[s] = map[key];
  }
  map['rs'] = map['rr'];
  return function(a,b){
    var t = a.type+b.type;
    if(map[t])
      return map[t](a,b);
    t = b.type+a.type;
    if(map[t])
      return map[t](b,a);
    throw new Error('Intersect: '+b.type+'/'+a.type);
    return map[b.type+a.type](b,a);
  };
})();

var Distance = (function(){
  var pointrect = function(p,r){
    var x = p.x;
    var y = p.y;
    var x1 = r.x1-x;
    var y1 = r.y1-y;
    var x2 = x-r.x2;
    var y2 = y-r.y2;
    console.log(x,y,x1,y1,x2,y2);
    if(x1>=0){
      if(y1>=0)
        return sqrt(x1*x1+y1*y1);
      if(y2>=0)
        return sqrt(x1*x1+y2*y2);
      return x1;
    }
    if(x2>=0){
      if(y1>=0)
        return sqrt(x2*x2+y1*y1);
      if(y2>=0)
        return sqrt(x2*x2+y2*y2);
      return x2;
    }
    if(y1>=0)
      return y1;
    if(y2>=0)
      return y2;
    return max(x1,y1,x2,y2);
  };
  var map = {
    'vv': function(a,b){
      var c = a.copy().sub(b);
      var len = c.len;
      c.delete();
      return len;
    },
    'vc': function(v,c){
      var x = v.copy().sub(c);
      var len = x.len-c.r;
      x.delete();
      return len;
    },
    'cc': function(a,b){
      var c = Vector.new().xy(a.x-b.x,a.y-b.y);
      var len = c.len-a.r-b.r;
      c.delete();
      return len;
    },
    'vr': function(v,r){
      return pointrect(v,r);
    },
    'cr': function(c,r){
      return pointrect(c,r)-c.r;
    },
    'rr': function(a,b){
      var c = Rectangle.new().xywh(b.x,b.y,b.w+a.w,b.h+a.h);
      var len = pointrect(a,c);
      c.delete();
      return len;
    },
    //'ce': function(c,e){
    //  return e.IntersectCircle(c.x,c.y,c.r);
    //}
  };
  for(var key in map){
    var s = key.replace(/r/g,'s');
    if(key!=s)
      map[s] = map[key];
  }
  map['rs'] = map['rr'];
  return function(a,b){
    var t = a.type+b.type;
    if(map[t])
      return map[t](a,b);
    t = b.type+a.type;
    if(map[t])
      return map[t](b,a);
    throw new Error('Distance: '+b.type+'/'+a.type);
    return map[b.type+a.type](b,a);
  };  
})();
  

/**
  Segment:
  .x1 - left corner, fided to x2
  .x2 - right corner, fixed to x1
  .x - center point, moves both x1 and x2
  .w2 - total length, fixed to x1, moves x2
  .w - half of length, fixed to x, moves both x1 and x2 
  .x1x2(x1,x2), .x1w2(x1,w2), .xw(x,w) - set all
**/

var Segment = (function(){
  var X0 = Private('Segment.$X0');
  var X1 = Private('Segment.$X1');
  var W1 = Private('Segment.$W1');
  var W2 = Private('Segment.$W2');
  var TX = Private('Segment.$TX');
  return Inherit(Base,{
    $new: function(){
      Base.$new.call(this);
      this[X0] = this[X1] = this[W1] = this[W2] = this[TX] = 0;
    },
    $delete: function(){
      Base.$delete.call(this);
    },
    x1x2:function(x1,x2){
      this[X1] = x1;
      this[W2] = x2-x1;
      this[TX] = 1;
      return this;
    },
    x1w2:function(x1,w2){
      this[X1] = x1;
      this[W2] = w2;
      this[TX] = 1;
      return this;
    },
    xw:function(x,w){
      this[X0] = x;
      this[W1] = w;
      this[TX] = -1;
      return this;
    },
    x1$get: function(){
      if(this[TX]>=0)
        return this[X1];
      this[TX] = 0;
      var w = this[W1];
      this[W2] = w+w;
      return (this[X1] = this[X0]-w);
    },
    x1$set: function(v){
      if(this[TX]<0)
        this[W2] = this[X0]+this[W1]-v;
      else if(this[X1]===v)
        return;
      else
        this[W2] += this[X1]-v;
      this[TX] = 1;
      this[X1] = v;
    },
    x2$get: function(){
      if(this[TX]>=0)
        return this[X1]+this[W2];
      this[TX] = 0;
      var w = this[W1];
      return (this[X1] = this[X0]-w)+(this[W2] = w+w);
    },
    x2$set: function(v){
      if(this[TX]>=0)
        this[W2] = v-this[X1];
      else
        this[W2] = v-(this[X1] = this[X0]-this[W1]);
      this[TX] = 1;
    },
    x$get: function(){
      if(this[TX]<=0)
        return this[X0];
      this[TX] = 0;
      return (this[X0] = this[X1]+(this[W1] = this[W2]/2));
    },
    x$set: function(v){
      if(this[TX]>0)
        this[W1] = this[W2]/2;
      else if(this[X0]===v)
        return;
      this[TX] = -1;
      this[X0] = v;
    },
    w$get: function(){
      if(this[TX]<=0)
        return this[W1];
      var w = (this[W1] = this[W2]/2);
      this[X0] = this[X1]+w;
      this[TX] = 0;
      return w;
    },
    w$set: function(v){
      if(this[TX]>0)
        this[X0] = this[X1]+this[W2]/2;
      else if(this[W1]===v)
        return;
      this[TX] = -1;
      this[W1] = v;
    },
    w2$get: function(){
      if(this[TX]>=0)
        return this[W2];
      this[TX] = 0;
      var w = this[W1];
      this[X1] = this[X0]-w;
      return (this[W2] = w+w);
    },
    w2$set: function(v){
      if(this[TX]<0)
        this[X1] = this[X0]-this[W1];
      else if(this[W2]===v)
        return;
      this[TX] = 1;
      this[W2] = v;
    },
  },'Segment');
})();


/**
  Rectangle: (Segment)
  adds segment for y1,y2,h,h2...
**/

var Rectangle = (function(){
  var H = Private('Rectangle.$H');
  return Inherit(Segment,{
    $new: function(){
      Segment.$new.call(this);
      this[H] = Segment.new();
    },
    $delete: function(){
      //console.log('!');
      this[H] = this[H].delete();
      Segment.$delete.call(this);
    },
    y1y2: function(y1,y2){
      this[H].x1x2(y1,y2);
      return this;
    },
    y1h2: function(y1,h2){
      this[H].x1w2(y1,h2);
      return this;
    },
    ltrd: function(x1,y1,x2,y2){
      return this.x1x2(x1,x2).y1y2(y1,y2);
    },
    xywh: function(x,y,w,h){
      return this.xw(x,w).yh(y,h);
    },
    ltw2: function(x1,y1,w2,h2){
      return this.x1x2(x1,x1+w2).y1y2(y1,y1+h2);
    },    
    yh:function(y,h){
      this[H].xw(y,h);
      return this;
    },
    y1$get: function(){
      return this[H].x1;
    },
    y1$set: function(v){
      this[H].x1 = v;
    },
    y2$get: function(){
      return this[H].x2;
    },
    y2$set: function(v){
      this[H].x2 = v;
    },
    y$get: function(){
      return this[H].x;
    },
    y$set: function(v){
      this[H].x = v;
    },
    h$get: function(){
      return this[H].w;
    },
    h$set: function(v){
      this[H].w = v;
    },
    h2$get: function(){
      return this[H].w2;
    },
    h2$set: function(v){
      this[H].w2 = v;
    },
    type: 'r',
  },'Rectangle');
})();


/** debug **/
var Rect1 = (function(){
  var X = Private('Rect1.$X');
  var W = Private('Rect1.$W');
  return Inherit(Base,{
    $new: function(){
      this[X] = 0;
      this[W] = 0;
    },
    x1$get: function(){
      return this[X]-this[W];
    },
    x1$set: function(v){
      var x2 = this[X]+this[W];
      var w = x2-v;
      this[W] = w/2;
      this[X] = v+this[W];
    },
    x2$get: function(){
      return this[X]+this[W];
    },
    x2$set: function(v){
      var x1 = this[X]-this[W];
      var w = v-x1;
      this[W] = w/2;
      this[X] = v-this[W];
    },
    x$get: function(){
      return this[X];
    },
    x$set: function(v){
      this[X] = v;
    },
    w$get: function(){
      return this[W];
    },
    w$set: function(v){
      this[W] = v;
    },
    w2$get: function(){
      return this[W]*2;
    },
    w2$set: function(v){
      var x1 = this[X]-this[W];
      this[W] = v/2;
      this[X] = x1+this[W];
    },
  });
})();

/** debug **/
var Rect2 = (function(){
  var X1 = Private('Rect2.$X1');
  var X2 = Private('Rect2.$X2');
  return Inherit(Base,{
    $new: function(){
      this[X1] = 0;
      this[X2] = 0;
    },
    x1$get: function(){
      return this[X1];
    },
    x1$set: function(v){
      this[X1] = v;
    },
    x2$get: function(){
      return this[X2];
    },
    x2$set: function(v){
      this[X2] = v;
    },
    x$get: function(){
      return (this[X2]+this[X1])/2;
    },
    x$set: function(v){
      v -= (this[X2]+this[X1])/2;
      this[X1] += v;
      this[X2] += v;
    },
    w$get: function(){
      return (this[X2]-this[X1])/2;
    },
    w$set: function(v){
      v = (v-(this[X2]-this[X1])/2);
      this[X1] -= v;
      this[X2] += v;
    },
    w2$get: function(){
      return this[X2]-this[X1];
    },
    w2$set: function(v){
      this[X2] += v-(this[X2]-this[X1]);
    },
  });
})();



//console.log(Vector);
/*
var Test = Inherit(Vector,{
  $new: function(){
    Vector.$new.call(this);
  },
  test: function(){return 'test!';},
});
*/
//throw console.log(Test.new().len1=1);

var ShapeVector = {
  Inherit: Inherit,
  Private: Private,
  Vector: Vector,
  Circle: Circle,
  Square: Square,
  Ellipse: Ellipse,
  //Rectangle00: Rectangle00,
  Rectangle: Rectangle,
  Segment: Segment,
  Rect: Rectangle,
  Rect1: Rect1,
  Rect2: Rect2,
  Intersect: Intersect,
};

if(typeof(module)!=='undefined')
  module.exports = ShapeVector;
if(typeof(window)!=='undefined')
  window.ShapeVector = ShapeVector;

//EOF