// FastQuad.js

"use strict"

var FastQuad;
var Finite = Number.isFinite || function(){return true;};
var Cache = [];
var Index = -1;
var Empty = false;
var Props = {
  $a: {
    configurable: false, enumerable: false, writable: true,
    value: null,
  },
  $1: {
    configurable: false, enumerable: false, writable: true,
    value: null,
  },
  $2: {
    configurable: false, enumerable: false, writable: true,
    value: null,
  },
  $3: {
    configurable: false, enumerable: false, writable: true,
    value: null,
  },
  $4: {
    configurable: false, enumerable: false, writable: true,
    value: null,
  },
  $s: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $x: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $y: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $w: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $h: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $c: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $m: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $o: {
    configurable: false, enumerable: false, writable: true,
    value: 0,
  },
  $r: {
    configurable: false, enumerable: false, writable: true,
    value: null,
  },
  $n: {
    configurable: false, enumerable: false, writable: true,
    value: null,
  },
};

function CreateQuad(x,y,size,root,main){
  var quad;
  if(Cache.length)
    quad = Cache.pop();
  else{
    quad = Object.create(FastQuad,Props);
    Object.preventExtensions(quad);
    quad.$a = [];
  }
  quad.$x = x;
  quad.$y = y;
  quad.$w = x+size;
  quad.$h = y+size;
  size >>= 1;
  quad.$c = x+size;
  quad.$m = y+size;
  quad.$s = size;
  quad.$r = root;  
  quad.$o = main ? 1 : -1;
  return quad;
};

function CachePush(quad){
  quad.$n = null;
  quad.$o = 0;
  Cache.push(quad);
};

function SeekUser(quad,obj){
  var find = SeekDown(quad,obj);
  if(find)
    return find;
  return SeekUp(quad,obj);
};

function SeekUp(quad,obj){
  var find;
  while(quad.$r){
    find = SeekDown(quad.$r,obj,quad);
    if(find)
      return find;
    quad = quad.$r;
  }
  return null;
};

function SeekDown(quad,obj,child){
  var index = quad.$a.indexOf(obj);
  if(index>=0){
    Index = index;
    return quad;
  }
  if(quad.$1 && quad.$1!==child){
    find = SeekDown(quad.$1,obj);
    if(find)
      return find;
  }
  if(quad.$2 && quad.$2!==child){
    find = SeekDown(quad.$2,obj);
    if(find)
      return find;
  }
  if(quad.$3 && quad.$3!==child){
    find = SeekDown(quad.$3,obj);
    if(find)
      return find;
  }
  if(quad.$4 && quad.$4!==child){
    find = SeekDown(quad.$4,obj);
    if(find)
      return find;
  }
  return null;
};

function MoveUser(quad,obj,x,y,w,h){
  var find = SeekUser(quad,obj);
  if(!find)
    throw null;
  quad = AddOuter(find,obj,x,y,w,h);
  if(quad===find)
    return quad;
  quad.$a.push(obj);
  var len = find.$a.length-1;
  if(len)
    find.$a[Index] = find.$a[len];
  Index = -1;
  find.$a.length = len;
  if(!len)
    DeleteQuad(find);
  return quad;
};

function DeleteQuad(quad){
  var root;
  while(quad.$r){
    if(quad.$a.length
    || quad.$1
    || quad.$2
    || quad.$3
    || quad.$4
    || quad.$o===1)
      return;
   root = quad.$r;
   quad.$r = null;
   if(root.$1===quad)
     root.$1 = null;
   if(root.$2===quad)
     root.$2 = null;
   if(root.$3===quad)
     root.$3 = null;
   if(root.$4===quad)
     root.$4 = null;
   CachePush(quad);
   quad = root;
  }
};

function AddUser(quad,obj,x,y,w,h){
  var quad = AddOuter(quad,obj,x,y,w,h);
  quad.$a.push(obj);
  return quad;
};

function AddOuter(quad,obj,x,y,w,h){
  while(true){
    var s = quad.$s;
    s += s;
    if(w>=quad.$w){
      if(!quad.$r){
        quad.$r = CreateQuad(quad.$x,quad.$y,s+s,null,false);
        quad.$r.$1 = quad;
      }
    }else if(h>=quad.$h){
      if(!quad.$r){
        quad.$r = CreateQuad(quad.$x-s,quad.$y,s+s,null,false);
        quad.$r.$2 = quad;
      }
    }else if(x<quad.$x){
      if(!quad.$r){
        quad.$r = CreateQuad(quad.$x-s,quad.$y-s,s+s,null,false);
        quad.$r.$4 = quad;  
      }
    }else if(y<quad.$y){
      if(!quad.$r){
        quad.$r = CreateQuad(quad.$x,quad.$y-s,s+s,null,false);
        quad.$r.$3 = quad;  
      }
    }else
      return AddInner(quad,obj,x,y,w,h);
    quad = quad.$r;
  }
};

function AddInner(quad,obj,x,y,w,h){
  if(false && !quad.$a.length || quad.$s<=2) // todo
    return quad;
  var c = quad.$c;
  var m = quad.$m;
  if(x>=c){
    if(y>=m){
      if(!quad.$4)
        quad.$4 = CreateQuad(c,m,quad.$s,quad,false);
      return AddInner(quad.$4,obj,x,y,w,h);
    }else if(h<m){
      if(!quad.$2)
        quad.$2 = CreateQuad(c,quad.$y,quad.$s,quad,false);
      return AddInner(quad.$2,obj,x,y,w,h);
    }
  }else if(w<c){
    if(y>=m){
      if(!quad.$3)
        quad.$3 = CreateQuad(quad.$x,m,quad.$s,quad,false);
      return AddInner(quad.$3,obj,x,y,w,h);
    }else if(h<m){
      if(!quad.$1)
        quad.$1 = CreateQuad(quad.$x,quad.$y,quad.$s,quad,false);
      return AddInner(quad.$1,obj,x,y,w,h);
    }
  }
  return quad;
};

function FindUser(quad,x,y,w,h,empty){
  Empty = empty;
  return FindOuter(quad,x,y,w,h,null);
};

function FindOuter(quad,x,y,w,h,next){
  while(quad.$r){
    if(x<quad.$x
    || y<quad.$y
    || w>quad.$w
    || h>quad.$h)
      quad = quad.$r;
    else
      break;
  }
  return FindInner(quad,x,y,w,h,next);
};

function FindInner(quad,x,y,w,h,next){
  if(quad.$x>=x
  && quad.$y>=y
  && quad.$w<=w
  && quad.$h<=h)
    return FindAll(quad,next);
  var q1=true,q2=true,q3=true,q4=true;
  if(x>=quad.$c)
    q1 = q3 = false;
  else if(w<quad.$c)
    q2 = q4 = false;
  if(y>=quad.$m)
    q1 = q2 = false;
  else if(h<quad.$m)
    q3 = q4 = false;
  if(q1 && quad.$1)
    next = FindInner(quad.$1,x,y,w,h,next);
  if(q2 && quad.$2)
    next = FindInner(quad.$2,x,y,w,h,next);
  if(q3 && quad.$3)
    next = FindInner(quad.$3,x,y,w,h,next);
  if(q4 && quad.$4)
    next = FindInner(quad.$4,x,y,w,h,next);
  if(quad.$a.length || Empty){
    quad.$n = next;
    return quad;
  }
  return next;
};

function FindAll(quad,next){
  if(quad.$1)
    next = FindAll(quad.$1,next);
  if(quad.$2)
    next = FindAll(quad.$2,next);
  if(quad.$3)
    next = FindAll(quad.$3,next);
  if(quad.$4)
    next = FindAll(quad.$4,next);
  if(quad.$a.length || Empty){
    quad.$n = next;
    return quad;
  }
  return next;
};

function ClearQuad(quad,_child){
  var no = null;
  if(quad.$1)
    no = (quad.$1 = ClearQuad(quad.$1,true)) || no;
  if(quad.$2)
    no = (quad.$2 = ClearQuad(quad.$2,true)) || no;
  if(quad.$3)
    no = (quad.$3 = ClearQuad(quad.$3,true)) || no;
  if(quad.$4)
    no = (quad.$4 = ClearQuad(quad.$4,true)) || no;
  quad.$a.length = 0;
  if(no || quad.$o===1)
    return quad;
  if(_child){
    quad.$r = null;
    CachePush(quad);
  }
  return null;
};

function EachCall(quad,next,empty){
  if(empty || quad.$a.length){
    quad.$n = next;
    next = quad;
  }
  if(quad.$1)
    next = EachCall(quad.$1,next,empty);
  if(quad.$2)
    next = EachCall(quad.$2,next,empty);
  if(quad.$3)
    next = EachCall(quad.$3,next,empty);
  if(quad.$4)
    next = EachCall(quad.$4,next,empty);
  return next;
};

function FreezeProps(proto){
  for(var key in proto)
    Object.defineProperty(proto,key,{
      configurable: false,
      enumerable: true,
      writable: false,
      value: proto[key],
    });
};

function Throw(){
  throw new Error('FastQuad: wrong number passed!');
};

FastQuad = {
  new: function(left,top,length){
    if(!( Finite(left) && Finite(top) && Finite(length)
    && length<0x80000000 && length>0 ))
      return Throw();
    var side = 2;
    length |= 0;
    while(side<length)
      side <<= 1;
    return CreateQuad(left|0,top|0,side,null,true);
  },
  gc: function(){ //todo
    var len = Cache.length;
    Cache.length = 0;
    return len;
  },
  Add: function(obj,left,top,width,height){
    if(!( Finite(left) && Finite(top) && Finite(width) && Finite(height)
    && width>=0 && height>=0 ))
      return Throw();
    return AddUser(this,obj,left|0,top|0,left+width|0,top+height|0);
  },
  Move: function(obj,left,top,width,height){
    if(!( Finite(left) && Finite(top) && Finite(width) && Finite(height)
    && width>=0 && height>=0 ))
      return Throw();
    return MoveUser(this,obj,left|0,top|0,left+width|0,top+height|0);
  },
  Find: function(left,top,width,height,empty){
    if(!( Finite(left) && Finite(top) && Finite(width) && Finite(height)
    && width>=0 && height>=0 ))
      return Throw();
    return FindUser(this,left|0,top|0,left+width|0,top+height|0,!!empty);
  },
  Each: function(empty){
    return EachCall(this,null,!!empty);
  },
  Root: function(){
    var root = this;
    while(root.$r)
      root = root.$r;
    return root;
  },
  Clear: function(){
    ClearQuad(this);
  },
};

FreezeProps(FastQuad);

Object.defineProperties(FastQuad,{
  array: {
    configurable: false, enumerable: true, get: function(){
      return this.$a;
    },
  },
  next: {
    configurable: false, enumerable: true, get: function(){
      return this.$n;
    },
  },
  size: {
    configurable: false, enumerable: true, get: function(){
      return this.$s;
    },
  },
  x: {
    configurable: false, enumerable: true, get: function(){
      return this.$c;
    }
  },
  y: {
    configurable: false, enumerable: true, get: function(){
      return this.$m;
    },
  },
  left: {
    configurable: false, enumerable: true, get: function(){
      return this.$x;
    },
  },
  top: {
    configurable: false, enumerable: true, get: function(){
      return this.$y;
    },
  },
  right: {
    configurable: false, enumerable: true, get: function(){
      return this.$w;
    },
  },
  bottom: {
    configurable: false, enumerable: true, get: function(){
      return this.$h;
    },
  },
});

Object.preventExtensions(FastQuad);

if(typeof(module)!=='undefined' && typeof(window)==='undefined')
  module.exports = FastQuad;
else
  window.FastQuad = FastQuad;

//EOF