# transition.js
JavaScript tweening engine for easy animations


# tween.js

JavaScript tweening engine for easy animations, incorporating optimised Robert Penner's equations.


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

### Transition.Easing

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
 
 start()            pause()/play()        stop()
 
### properties:
```javascript
tarnsition.paused    //true or false
````




