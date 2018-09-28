# Transition.js
JavaScript tweening engine for easy animations


```javascript
var values = { x: 0, y: 0 };
var trans = new Transition(coords)
	.to({ x: 100, y: 100 }, 1000)
	.on("update",function() {
		console.log(this.x, this.y);
	})
	.start();

requestAnimationFrame(animate);

function animate(time) {
	requestAnimationFrame(animate);
	Transition.update(time);
}
```

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





