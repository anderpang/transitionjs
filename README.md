# Transition.js
JavaScript tweening engine for easy animations


```javascript
var values = { x: 0, y: 0 };
var trans = new Transition(values)
	.to({ x: 100, y: 100 }, 1000)
	.on("update",function(target) {
		console.log(target.x, target.y);
	})
	.start();

requestAnimationFrame(animate);

function animate(time) {
	requestAnimationFrame(animate);
	Transition.update(time);
}
```
```javascript
var trans = new Transition({ x: 0, y: 0 })
	.to({ x: 100, y: 100 }, 1000)
	.to({ x: 100, y: "+100"},{ duration: 2000, delay: 1000 })
	.on("update",function(target) {
		console.log(target.x, target.y);
	})
	.start();

requestAnimationFrame(animate);

function animate(time) {
	requestAnimationFrame(animate);
	Transition.update(time);
}
```

#### 有了Tween.js和TweenLite.js，为什么还要Transition.js
![因为](https://cdn.files.qdfuns.com/article/content/picture/201809/28/175853bsmkj6iqsf7msfzj.jpg)

### Show
<a href="http://htmlpreview.github.io/?https://github.com/anderpang/transitionjs/blob/master/index.html" target="_blank">index.html</a>

<a href="http://htmlpreview.github.io/?https://github.com/anderpang/transitionjs/blob/master/index.html" target="_blank">demo.html</a>

### Transition.Easing

缓动算法引用tween.js

Linear:{None: ƒ}

Quad:{In: ƒ, Out: ƒ, InOut: ƒ}

Cubic:{In: ƒ, Out: ƒ, InOut: ƒ}

Back:{In: ƒ, Out: ƒ, InOut: ƒ}

Bounce:{In: ƒ, Out: ƒ, InOut: ƒ}

Circ:{In: ƒ, Out: ƒ, InOut: ƒ}

Elastic:{In: ƒ, Out: ƒ, InOut: ƒ}

Expo:{In: ƒ, Out: ƒ, InOut: ƒ}

Quart:{In: ƒ, Out: ƒ, InOut: ƒ}

Quint:{In: ƒ, Out: ƒ, InOut: ƒ}

Sine:{In: ƒ, Out: ƒ, InOut: ƒ}

### Transition.Events

```javascript
{
    "START": "start",
    "UPDATE": "update",
    "NEXT": "next",
    "COMPLETE": "complete",
    "STOP": "stop",
    "REPEAT": "repeat"
}
```

### Transition Methods
```javascript
   Transition.play();
   Transition.pause();
   Transition.update(time);
   
   doument.addEventListener("visibilitychange",function(){
        if(document.hidden)
	{
	    Transition.pause();
	}
	else
	{
	    Transition.play();
	}
   },false);
```


### Methods
```javascript
transition.start();
transition.play();
transition.pause();
transition.stop();
transition.update();

transition.yoyo(boolean);
transition.repeat(int);

```

timeline:

  |-------------------|---------------------|
 
 start() &emsp; &emsp; &emsp; &emsp;pause()/play()  &emsp; &emsp; &emsp; &emsp; &emsp;       stop()
 
### properties:
```javascript
tarnsition.paused    //true or false
````





