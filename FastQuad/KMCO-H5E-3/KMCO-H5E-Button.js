// KMCO-H5E-Button.js

"use strict";

(function KMCO_H5E_Button(){
  
var Global = typeof(global)!=='undefined'&&global['KMCO-H5E']||window['KMCO-H5E'];
var Inherit = Global.Inherit;
var Private = Inherit.Private;

var Button = (function Button(Button){
  var Aligned = Inherit.Parent('Aligned');
  var Strokable = Inherit.Parent('Strokable');
  //var C = Private('$Button.C$');
  return Button = Inherit([Aligned,Strokable],{
    $new: function(canvas,delegate){
      Strokable.$new.call(this,canvas,delegate);
      Aligned.$new.call(this,delegate);
    },
    $delete: function(){
      Strokable.$delete.call(this);
      Aligned.$delete.call(this);
    },
    copy: function(button){
      Strokable.copy.call(this,button);
      Aligned.copy.call(this,button);      
      return this;
    },
    draw: function(){      
      Strokable.draw.call(this);
      this.canvas.draw_rect(this.x1,this.y1,this.width,this.height);
      return this;
    },
  },'Button');
})();//Button

Global.Button = Button; 

})();//KMCO_H5E_Mouse

//EOF