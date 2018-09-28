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



