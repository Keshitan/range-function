# range-function
 Are you just now getting started with **Python** to **Node.js**?
<br>
This allows you to use the range function as you would write it in Python.

For example, if you have the following code

```Python
# in Python

R = range(2, 10, 2)

3 in R  # -> False
8 in R  # -> True

for r in R:
  pass  # -> 2 4 6 8

R = R[::-1]
# -> range(8, 0, -2)
```

In Node.js, there is no range function like in Python. So many people will substitute Array. But its behavior will annoy us.
```Node
// in Node.js (before)

let A = [ 2, 4, 6, 8 ];

3 in A //=> true
8 in A //=> false 🤔

for (let a in A) {
  //=> "0" "1" "2" "3" (unsuitable code) 👾
}

for (let a of A) {
  //=> 2 4 6 8
}

A = A[::-1]
//=> SyntaxError: Unexpected token ':' 😵
```

The range-function can be used to solve the above problem
```Node
// in Node.js (after)
const { range } = require("./src/range");

let R = range(2, 10, 2);

3 in R //=> false
8 in R //=> true 🙂

for (let a in A) {
  //=> SyntaxError: You cannot use ... 'for...in RangeObject'.` 🔍
}

for (let a of A) {
  //=> 2 4 6 8
}

R = R("None", "None", -1);
//=> range(8, 0, -2) 👍
```
In addition, IntelliSense also works. Please try it!
![IntelliSense.png](https://cdn.discordapp.com/attachments/742006750391042198/987202710539477032/unknown.png "IntelliSense-img")
