/*!
 * Transition.js 1.2.0
 * https://github.com/anderpang/transitionjs
 * <anderpang@foxmail.com>
 */
"use strict";

 (function(scope,factory){
    typeof module !== "undefined" && module.exports?module.exports=factory():scope.Transition=factory();    
 })(this,function(){
   if (typeof Object.assign !== 'function') {
       // Must be writable: true, enumerable: false, configurable: true
       Object.defineProperty(Object, "assign", {
         value: function assign(target, varArgs) { // .length of function is 2
           if (target == null) { // TypeError if undefined or null
             throw new TypeError('Cannot convert undefined or null to object');
           }
     
           var to = Object(target);
     
           for (var index = 1; index < arguments.length; index++) {
             var nextSource = arguments[index];
     
             if (nextSource != null) { // Skip over if undefined or null
               for (var nextKey in nextSource) {
                 // Avoid bugs when hasOwnProperty is shadowed
                 if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                   to[nextKey] = nextSource[nextKey];
                 }
               }
             }
           }
           return to;
         },
         writable: true,
         configurable: true
       });
     }
   
    //当前播放列表
    var playList=Object.create(null),
        pfm=performance,
        getNow=pfm.now?function(){
            return pfm.now();
        }:function(){
           return Date.now()-pfm.timing.navigationStart;
        },
        //默认选项
        defaultOption={
           duration:1000,
           delay:0
        };
        playList.queues=[];
   
        playList.add=function(trans){
           var queues=this.queues,
               i=queues.indexOf(trans);
           i===-1&&queues.push(trans);
           return this;
        };
       //  playList.remove=function(trans){
       //     var queues=this.queues,
       //         i=queues.length;
       //    while(i--){
       //        if(queues[i]===trans){
       //            queues.splice(i,1);
       //            break;
       //        }
       //    }
       //     return this;
       //  };
        playList.removeAll=function(){
            this.queues.length=0;
        };
   
    function Transition(target,from){
         //yoyo
         //repeat
         //delay
        this._target=target;
        this._chains=[new Core(from||target,null,0)];
        this._listeners=Object.create(null);
        this._pausedTime=0;
        this._repeat=this.__repeat=1;
        this._reverse=false;
        this.paused=true;
    }
   
    Transition.VERSION="1.0.0";
    
    function Core(props,prevProps,options){
        this.props=copyProps(props,prevProps);
        this.options=Object.assign({},defaultOption,
           typeof options==="number"?
           {
            duration:options
           }:options);
    }
   
   
    function copyProps(props,prevProps){
       var out=Object.create(null),
           k,
           v,
           tye;
   
       for(k in props){
           v=props[k];
           if(!isNaN(v)){
               tye=typeof v;
               if(tye==="number"){
                   out[k]=v;
               }
               else if(tye==="string"){
                   tye=v.charCodeAt(0);
                   v=parseFloat(v);
                   if(tye===43 || tye===45){
                      out[k]=prevProps?prevProps.props[k]+v:v;
                   }
                   else{
                      out[k]=v;
                   }
               }
           }            
       }
       return out;
    }
   
    Transition.prototype={
        contructor:Transition,
        _current:0,
        _pauseStartTime:0,
        to:function(props,duration){
           var chains=this._chains;
            chains.push(new Core(props,chains[chains.length-1],duration));
   
           return this;
        },
       
        start:function(timeStamp){  
           this.paused=this._reverse=false;          
           this._current=this._pausedTime=0;
           this._yoyo && (this._chains=this.__chains);
           this._chains[0].startTime=(timeStamp||getNow());            
           playList.add(this);         
           this.emit("start",this._target);
           return this;
        },
   
        play:function(timeStamp){
            if(this.paused)
            {
               this.paused=false;
               timeStamp || (timeStamp=getNow());
               if(this._pauseStartTime){
                   this._chains[this._current].startTime+=timeStamp-this._pauseStartTime;
                   this._pauseStartTime=0;
                   
               }
               else{
                   this._chains[this._current].startTime=timeStamp;
               }
               playList.add(this);
           }
           return this;
        },
        yoyo:function(bl){
           this.__chains=this._chains;
           this._chains2=this._chains.slice().reverse();
           this._yoyo=bl;
           return this;
        },
        pause:function(timeStamp){
           if(!this.paused)
           {
               this.paused=true;
               this._pauseStartTime=timeStamp||getNow();
           }
           return this;
        },
        stop:function(){
           this.paused=true;
           this._current=this._pausedTime=0;            
           this._repeat=this.__repeat;
           this.emit("stop",this._target);
           return this;
        },
        update:function(timeStamp){
            if(this.paused) return this;   
   
            var chains=this._chains,
                chainsLen=chains.length,
                target=this._target,
                current=this._current,
                startCore,
                endCore,
                startProps,
                endProps,
                baseValue,
                elapsed,
                options,
                progress,
                value;
   
               if(chainsLen===1){                    
                   return this;
               }
           
            timeStamp || (timeStamp=getNow());
            startCore=chains[current];
            endCore=chains[current+1];
   
            elapsed=timeStamp-startCore.startTime;
   
            options=this._reverse?startCore.options:endCore.options;
            
            if(elapsed<options.delay){
               return this;
            }
           
            progress=Math.min(1,(elapsed-options.delay)/options.duration);
            value=options.easing(progress);
   
            startProps=startCore.props;
            endProps=endCore.props;
   
            for(var k in endProps){
                baseValue=startProps[k];
                target[k]=baseValue+(endProps[k]-baseValue)*value;
            }
           
            this.emit("update",target,progress);
   
            if(progress===1){
               ++this._current===chainsLen-1?
               this._complete(timeStamp): 
               this._next(endCore,timeStamp);
            }
   
           return this;
        },
        _next:function(endCore,timeStamp){
           endCore.startTime=timeStamp;
           this._pausedTime=this._pauseStartTime=0;
           return this.emit("next",this._target,this._current);
        },
        _repeat_f:function(timeStamp){   
            this._current=this._pausedTime=0;  
                   
            this.emit("repeat",this._target,this.__repeat-this._repeat);
            if(this._yoyo){
                this._reverse=!this._reverse;
                this._chains=this._reverse?this._chains2:this.__chains;
            }
            this._chains[0].startTime=(timeStamp||getNow());
            return this;
        },
        _complete:function(timeStamp){
            if(--this._repeat){
                this._repeat_f(timeStamp);
            }
            else
            {
               this.stop(timeStamp).emit("complete",this._target);
            }
            return this;
        },
        distory:function(){
           this.paused=true;
           return this;
        },
        repeat:function(times){
          this._repeat=this.__repeat=isFinite(times)?times:0;
          return this;
        },
        on:function(type,fn){
           var listeners=this._listeners,
               queues=listeners[type];
           if(queues){
               queues.push(fn);
           }
           else{
               listeners[type]=[fn];
           }
           return this;
        },
        emit:function(type,a,b){
           var queues=this._listeners[type],
               ii,
               i;
           if(!queues)return this;
   
            for(i=0,ii=queues.length;i<ii;i++){
                queues[i].call(this,a,b);
            }
            return this;
        }
    };
   
    Transition.pause=function(timeStamp){
        var queues=playList.queues,
            i=queues.length,
            item;
   
        while(i--){
            item=queues[i];
            if(!item.paused){
               item._paused_=true;
               item.pause(timeStamp);
            }                  
        }
        return this;
    };
    Transition.play=function(timeStamp){
       var queues=playList.queues,
            i=queues.length,
            item;
   
        while(i--){
            item=queues[i];
            if(item._paused_)
            {
               item._paused_=false;
               item.play(timeStamp);
            }
        }
        return this;
    };
    Transition.update=function(timeStamp){
       var queues=playList.queues,
            i=queues.length,
            item;
   
        while(i--){
            item=queues[i];
            item.paused?
                queues.splice(i,1):
                item.update(timeStamp);             
        }
        return this;
    };
   
    Transition.now=getNow;

    Transition._nullObject=Object.create(null);
    Transition.delay=function(cb,delay){
       new this(this._nullObject)
           .to(this._nullObject,delay)
           .on("complete",cb)
           .start();
       return this;
    };
   
    Transition.Events={
        START:"start",
        UPDATE:"update",
        NEXT:"next",
        COMPLETE:"complete",
        STOP:"stop",
        REPEAT:"repeat"
    };
    
    Transition.Easing = {
       Linear: {
   
           None: function (k) {    
               return k;    
           }
   
       },
       Quad: {
           In: function (k) {
   
               return k * k;
   
           },
   
           Out: function (k) {
   
               return k * (2 - k);
   
           },
   
           InOut: function (k) {
   
               if ((k *= 2) < 1) {
                   return 0.5 * k * k;
               }
   
               return - 0.5 * (--k * (k - 2) - 1);
   
           }
       },
       Cubic: {
           In: function (k) {
   
               return k * k * k;
   
           },
   
           Out: function (k) {
   
               return --k * k * k + 1;
   
           },
   
           InOut: function (k) {
   
               if ((k *= 2) < 1) {
                   return 0.5 * k * k * k;
               }
   
               return 0.5 * ((k -= 2) * k * k + 2);
   
           }
   
       },
       Quart: {
           In: function (k) {
   
               return k * k * k * k;
   
           },
   
           Out: function (k) {
   
               return 1 - (--k * k * k * k);
   
           },
   
           InOut: function (k) {
   
               if ((k *= 2) < 1) {
                   return 0.5 * k * k * k * k;
               }
   
               return - 0.5 * ((k -= 2) * k * k * k - 2);
   
           }
       },
       Quint: {
           In: function (k) {
   
               return k * k * k * k * k;
   
           },
   
           Out: function (k) {
   
               return --k * k * k * k * k + 1;
   
           },
   
           InOut: function (k) {
   
               if ((k *= 2) < 1) {
                   return 0.5 * k * k * k * k * k;
               }
   
               return 0.5 * ((k -= 2) * k * k * k * k + 2);
   
           }
       },
       Sine: {
           In: function (k) {
   
               return 1 - Math.cos(k * Math.PI / 2);
   
           },
   
           Out: function (k) {
   
               return Math.sin(k * Math.PI / 2);
   
           },
   
           InOut: function (k) {
   
               return 0.5 * (1 - Math.cos(Math.PI * k));
   
           }
       },
       Expo: {
           In: function (k) {
   
               return k === 0 ? 0 : Math.pow(1024, k - 1);
   
           },
   
           Out: function (k) {
   
               return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
   
           },
   
           InOut: function (k) {
   
               if (k === 0) {
                   return 0;
               }
   
               if (k === 1) {
                   return 1;
               }
   
               if ((k *= 2) < 1) {
                   return 0.5 * Math.pow(1024, k - 1);
               }
   
               return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
   
           }
       },
       Circ: {
           In: function (k) {
   
               return 1 - Math.sqrt(1 - k * k);
   
           },
   
           Out: function (k) {
   
               return Math.sqrt(1 - (--k * k));
   
           },
   
           InOut: function (k) {
   
               if ((k *= 2) < 1) {
                   return - 0.5 * (Math.sqrt(1 - k * k) - 1);
               }
   
               return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
   
           }
       },
       Elastic: {
           In: function (k) {
   
               if (k === 0) {
                   return 0;
               }
   
               if (k === 1) {
                   return 1;
               }
   
               return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
   
           },
   
           Out: function (k) {
   
               if (k === 0) {
                   return 0;
               }
   
               if (k === 1) {
                   return 1;
               }
   
               return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
   
           },
   
           InOut: function (k) {
   
               if (k === 0) {
                   return 0;
               }
   
               if (k === 1) {
                   return 1;
               }
   
               k *= 2;
   
               if (k < 1) {
                   return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
               }
   
               return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
   
           }
       },
       Back: {
           In: function (k) {
   
               var s = 1.70158;
   
               return k * k * ((s + 1) * k - s);
   
           },
   
           Out: function (k) {
   
               var s = 1.70158;
   
               return --k * k * ((s + 1) * k + s) + 1;
   
           },
   
           InOut: function (k) {
   
               var s = 1.70158 * 1.525;
   
               if ((k *= 2) < 1) {
                   return 0.5 * (k * k * ((s + 1) * k - s));
               }
   
               return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
   
           }
       },
       Bounce: {
           In: function (k) {
   
               return 1 - Transition.Easing.Bounce.Out(1 - k);
   
           },
   
           Out: function (k) {
   
               if (k < (1 / 2.75)) {
                   return 7.5625 * k * k;
               } else if (k < (2 / 2.75)) {
                   return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
               } else if (k < (2.5 / 2.75)) {
                   return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
               } else {
                   return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
               }
   
           },
   
           InOut: function (k) {
   
               if (k < 0.5) {
                   return Transition.Easing.Bounce.In(k * 2) * 0.5;
               }
   
               return Transition.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
   
           }
       }
   };
   
   defaultOption.easing=Transition.Easing.Quad.Out;

    return Transition;
 });
