// KMCO-H5E-Dirty.js

"use strict";

(function KMCO_H5E_Dirty(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Dirty = (function Dirty(Dirty){
  var Base = Inherit.Base;
  var D = Private('$Dirty.D$');
  var C = Private('$Dirty.C$');
  var O = Private('$Dirty.O$');
  return Dirty = Inherit(Base,{
    [D]: null,
    [C]: true,
    [O]: null,
    $new: function(delegate){
      Base.$new.call(this);
      this[D] = delegate;
    },
    $delete: function(){
      Base.$delete.call(this);
      this[D] = null;
      this[O] = null;
    },
    copy: function(dirty){
      var me = this[D]&&this[D]._dirty_ ? this[D] : this;
      var it = dirty[D]&&dirty[D]._dirty_ ? dirty[D] : dirty;
      me[C] = it[C];
      return Base.copy.call(this);
    },
    own: function(owner){
      if(this[O])
        throw new Error('Dirty.own() twice!');
      if(owner[O])
        throw new Error('Dirty.own(owner.own?)');
      this[O] = owner;
      return this;
    },
    dirty_: function(){
      var me = this[D]&&this[D]._dirty_ ? this[D] : this;
      if(!me[C])
        return this;
      me[C] = false;
      if(me[D]){
        var o = this[O];
        while(o[O])
          o = o[O];
        me[D].call(me,o);
      }
      return this;
    },
    clean_: function(){
      var me = this[D]&&this[D]._dirty_ ? this[D] : this;
      if(me[C])
        return false;      
      return (me[C] = true);
    },
    _dirty_: true,
  },'Dirty');
})();//Dirty

Global.Dirty = Dirty;

})();//KMCO_H5E_Dirty

//EOF