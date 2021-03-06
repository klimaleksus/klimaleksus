// KMCO-H5E-Inherit.js v1.0

"use strict";

(function KMCO_H5E_Inherit(){

var USE_SYMBOL = true;
var OBJECT_CACHE = 100;

/*
var Sample = (function Sample(Sample){
  var Private = Inherit.Private;
  var p = Private('$Sample.p');
  return Sample = Inherit(Inherit.Base,{
    a: 0,
    b: 0,
    $new: function(dirty){
      Base.$new.call(this);
      this[p] = 0;
      this.a = this.b = 0;
    },
    $delete: function(){
      Base.$delete.call(this);
    },
    copy: function(){
      var o = Sample.new();
      o[p] = this[p];
      return o.ab(this.a,this.b);
    },
    ab: function(a,b){
      this.a = a;
      this.b = b;
      return this;      
    },
    p$get: function(){
      return this[p];      
    },
    p$set: function(v){
      this[p] = v;
    },
  },'Color');
  function test(o){
    return o.a*o.b+o[p];
  };
},'Sample')();
*/

var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];

if(USE_SYMBOL){
  Inherit.Private = (function Private(name){
    return Symbol(name);
  });
}else{
  Inherit.Private = (function(){
    var count = 0;
    return (function Private(name){
      return name+'/'+(++count);
    });
  })();
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
  var props = Object.create(null);
  var list = Object.create(null);
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
    }else if(key[key.length-1]==='$'){
      var name = key.substring(0,key.length-1);
      list[name] = obj[key];
      props[name] = {
        configurable: false,
        enumerable: true,
        writable: true,
        value: obj[key],
      };
    }else
      res[key] = {
        configurable: false,
        enumerable: true,
        writable: false,
        value: obj[key],
      };
  }
  var syms = Object.getOwnPropertySymbols(obj);
  for(var i=0,n=syms.length; i<n; i++){
    var key = syms[i];
    list[key] = obj[key];
    props[key] = {
      configurable: false,
      enumerable: true,
      writable: true,
      value: obj[key],
    };
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
    value: classname ? Inherit.Private(classname) : null,
  };
  res['$$'] = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: props,
  };
  res['$_'] = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: list,
  };
  obj = Object.create(null);
  Object.defineProperties(obj,res);
  Object.preventExtensions(obj);
  if(classname)
    Inherit[classname] = obj;
  return obj;
};

var Base = (function Base(){
  var recycle = Object.create(null);
  var cache = OBJECT_CACHE;
  var hOP = Object.prototype.hasOwnProperty;
  return Inherit({
    new: function(){
      if(!hOP.call(this,''))
        throw new Error('Inherit: called .new on object instead of prototype');
      var S = this.$;
      var me;
      if(S && recycle[S] && recycle[S].length){
        me = recycle[S].pop();
        if(this.$_)
          Object.assign(me,this.$_);
      }
      else{
        me = Object.create(this);
        if(this.$$)
          Object.defineProperties(me,this.$$);
        Object.preventExtensions(me);
      }
      this.$new.apply(me,arguments);
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
    toString: function(){
      if(this.$)
        return '[object '+this.s+']';
      return '[object _Object]';      
    },
    $new: function(){},
    $delete: function(){},
  });
})();//Base

Inherit.Base = Base;
Global.Inherit = Inherit; 

})();//KMCO_H5E_Inherit

//EOF