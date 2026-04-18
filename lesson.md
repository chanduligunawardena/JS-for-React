# JavaScript for Developers

> **Full-stack Engineering Program — Week 1**
>
> A compressed tour of JavaScript fundamentals for developers coming from other languages. Covers variables, types, functions, scope, closures, ES6+ features, DOM manipulation, and async patterns.

---

## 1. Variables & Operators

Three ways to declare variables:

| Keyword | Scope    | Reassign? | Hoisted?               |
|---------|----------|-----------|------------------------|
| `var`   | Function | Yes       | Yes (as `undefined`)   |
| `let`   | Block    | Yes       | Yes (TDZ — throws)     |
| `const` | Block    | No        | Yes (TDZ — throws)     |

```js
const name = "Alice";
let age = 25;
age = 26; // OK — let allows reassignment
// name = "Bob"; // TypeError: Assignment to constant variable
```

**The rule:** Use `const` by default. Use `let` when you need to reassign. Avoid `var`.

**Strict vs loose equality:**

```js
5 == "5";   // true  — loose equality (converts types)
5 === "5";  // false — strict equality (no conversion)
```

> Always use `===` and `!==`. Loose equality has surprising rules you don't want to memorize.

---

## 2. Data Types

### Primitives

| Type        | Example              | Notes |
| ----------- | -------------------- | ----- |
| `string`    | `"hello"`, `'world'` | Immutable |
| `number`    | `42`, `3.14`, `NaN`  | No int/float distinction |
| `boolean`   | `true`, `false`      | |
| `undefined` | `undefined`          | Declared but not assigned |
| `null`      | `null`               | Intentional "empty" |
| `bigint`    | `9007199254740991n`  | Large integers |
| `symbol`    | `Symbol("id")`       | Unique identifiers |

**JS quirks:**

```js
typeof null;      // "object"  — a famous bug, never fixed
typeof NaN;       // "number"  — NaN is technically a number
0.1 + 0.2;       // 0.30000000000000004 — floating point precision
```

### Strings

```js
const str = "Hello, World!";
str.toUpperCase();     // "HELLO, WORLD!"
str.slice(0, 5);       // "Hello"
str.split(", ");       // ["Hello", "World!"]
str.includes("World"); // true
str.trim();            // removes whitespace from both ends
```

**Template literals** — backticks for interpolation:

```js
const greeting = `Hello, ${name}! You are ${20 + 5} years old.`;
```

### Arrays

```js
const arr = [1, 2, 3, 4, 5];

// Mutating
arr.push(6);      // add to end
arr.pop();        // remove from end
arr.unshift(0);   // add to start
arr.shift();      // remove from start
arr.splice(1, 1); // remove 1 element at index 1

// Non-mutating
arr.slice(1, 3);  // [2, 3] — new array
arr.includes(3);  // true
```

**The iteration methods (you'll use these constantly):**

```js
arr.forEach((item) => console.log(item));       // just loops, returns nothing
arr.map((item) => item * 2);                    // [2, 4, 6, 8, 10] — transforms
arr.filter((item) => item > 2);                 // [3, 4, 5] — keeps matches
arr.reduce((sum, item) => sum + item, 0);       // 15 — reduces to single value
arr.find((item) => item > 3);                   // 4 — first match
```

### Objects

```js
const person = { name: "Alice", age: 25 };

person.name;            // dot notation
person["age"];          // bracket notation

Object.keys(person);    // ["name", "age"]
Object.values(person);  // ["Alice", 25]
Object.entries(person); // [["name", "Alice"], ["age", 25]]
```

### Type Coercion & Falsy Values

```js
"5" + 3;       // "53"  — + with a string = concatenation
"5" - 3;       // 2     — - always does math
```

These are **falsy** — everything else is truthy:

```js
false, 0, "", null, undefined, NaN
```

> Use `===` and explicit conversions (`Number()`, `String()`, `Boolean()`) to avoid surprises.

---

## 3. Functions

### Three Syntaxes

```js
// Declaration — hoisted (can call before the definition)
function add(a, b) {
  return a + b;
}

// Expression — not hoisted
const subtract = function (a, b) {
  return a - b;
};

// Arrow — concise, no own `this`
const multiply = (a, b) => a * b;
const double = n => n * 2;          // single param: no parens needed
const getRandom = () => Math.random(); // no params: empty parens required
```

### Default & Rest Parameters

```js
function greet(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10
```

### Functions as First-Class Values

Functions are values — store them, pass them, return them:

```js
// Callback pattern
function applyOperation(a, b, operation) {
  return operation(a, b);
}
applyOperation(5, 3, (a, b) => a + b); // 8

// Factory pattern (returns a function)
function createMultiplier(factor) {
  return (n) => n * factor;
}
const triple = createMultiplier(3);
triple(5); // 15
```

### Recursion

A function that calls itself, with a base case to stop:

```js
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}
factorial(5); // 120
```

---

## 4. Scope & Closures

### Scope

Scope determines where variables are accessible:

- **Global** — accessible everywhere
- **Function** — accessible only inside the function (`var`)
- **Block** — accessible only inside `{}` (`let`/`const`)

```js
if (true) {
  var leaked = "I escape the block";
  let contained = "I stay here";
}
console.log(leaked);    // "I escape the block"
// console.log(contained); // ReferenceError
```

### Hoisting & TDZ

`var` declarations are hoisted to the top of their scope but assigned `undefined`. `let`/`const` are hoisted but sit in a **Temporal Dead Zone** until the declaration — accessing them throws.

```js
console.log(a); // undefined
console.log(b); // ReferenceError: Cannot access 'b' before initialization

var a = 1;
let b = 2;
```

### Closures

A closure is a function that remembers the variables from the scope where it was created, even after that scope has finished executing.

```js
function outer() {
  const message = "Hello";
  return function inner() {
    console.log(message); // "closes over" message
  };
}

const fn = outer();
fn(); // "Hello" — message is still accessible
```

**Closure for private state:**

```js
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
// count is not accessible from outside — it's private
```

**Common closure patterns:**

```js
// Memoization — cache results
function memoize(fn) {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    return (cache[key] = fn(...args));
  };
}

// Once — function callable only once
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (called) return result;
    called = true;
    return (result = fn(...args));
  };
}
```

---

## 5. ES6+ Features

### Destructuring

```js
// Object destructuring
const { name, age } = { name: "Alice", age: 25, city: "London" };

// Renaming and defaults
const { name: fullName, country = "Unknown" } = person;

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Swapping without a temp variable
let a = 1, b = 2;
[a, b] = [b, a];

// In function parameters
function greet({ name, greeting = "Hello" }) {
  return `${greeting}, ${name}!`;
}
```

### Spread & Rest

```js
// Spread — expands iterables
const arr2 = [...arr1, 4, 5];
const obj2 = { ...obj1, c: 3 };

// Rest — collects remaining args
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
```

### Optional Chaining & Nullish Coalescing

```js
// ?. — short-circuits on null/undefined
const city = user?.address?.city;
user?.getProfile?.();
arr?.[0];

// ?? — defaults only for null/undefined (not falsy)
const name = user.name ?? "Anonymous";
0 ?? "default";    // 0     (0 is not null/undefined)
0 || "default";    // "default" (0 is falsy)
```

---

## 6. DOM Manipulation

### Selecting Elements

```js
const el = document.querySelector("#hero");         // first match
const all = document.querySelectorAll(".nav-link");  // NodeList of all matches
```

A NodeList has `forEach` but not `map`/`filter`. Spread to convert: `[...nodeList]`.

### Reading & Modifying

```js
el.textContent = "New text";                   // safe — no HTML injection
el.innerHTML = "<strong>Bold</strong> text";   // parses HTML — use with caution
el.setAttribute("href", "/about");
el.dataset.tab;                                // reads data-tab="..." attribute
el.style.backgroundColor = "blue";             // inline style (camelCase)
```

### classList

```js
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("open");      // add if missing, remove if present
el.classList.contains("open");    // true / false
```

> Prefer `classList` over `className` — it won't overwrite other classes.

### Events

```js
button.addEventListener("click", (event) => {
  event.target;            // the element that was clicked
  event.preventDefault();  // stop browser's default behavior
});
```

**Event delegation** — one listener on the parent instead of one per child:

```js
document.querySelector("ul").addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    event.target.classList.toggle("completed");
  }
});
```

Events **bubble up** from child to parent. Delegation leverages this — one listener catches all children, including dynamically added ones.

### Creating & Removing Elements

```js
// Create → configure → attach
const li = document.createElement("li");
li.textContent = "New item";
document.querySelector("#list").appendChild(li);

// Remove
li.remove();

// Remove all matching
document.querySelectorAll(".completed").forEach(el => el.remove());
```

### Forms

```js
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop page reload

  const name = form.querySelector("input[type='text']").value;
  console.log(name);

  form.reset(); // clear all fields
});
```

---

## 7. Async JavaScript

### Why Async?

JavaScript is **single-threaded** — one call stack, one thing at a time. Without async, any long-running operation (network request, timer) would freeze the page. Async lets JS say: "Start this task, keep doing other work, come back when it's ready."

### The Event Loop

```
 ┌──────────────────────────────┐
 │         Call Stack            │  ← JS runs code here (one at a time)
 └──────────┬───────────────────┘
            │ empty?
            ▼
 ┌──────────────────────────────┐
 │      Microtask Queue          │  ← Promise .then(), queueMicrotask()
 │      (drain ALL first)        │
 └──────────┬───────────────────┘
            │ empty?
            ▼
 ┌──────────────────────────────┐
 │       Task Queue              │  ← setTimeout, setInterval, I/O
 │       (pick ONE)              │
 └──────────────────────────────┘
            │
            └── repeat ──────────── The Event Loop
```

```js
console.log("1");
setTimeout(() => console.log("2"), 0);         // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
console.log("4");

// Output: 1, 4, 3, 2
```

Synchronous code first, then all microtasks, then one macrotask. Repeat.

### Callbacks

The original async pattern — "here's a function, call it when you're ready":

```js
function fetchUser(id, callback) {
  setTimeout(() => callback(null, { id, name: "Alice" }), 100);
}

// Error-first convention: callback(error, result)
fetchUser(1, (error, user) => {
  if (error) return console.error(error);
  console.log(user.name);
});
```

Nested callbacks create the **pyramid of doom**. This is why promises were invented.

### Promises

A promise represents a value that will be available in the future. Three states: **pending**, **fulfilled**, **rejected**.

```js
// Creating
const promise = new Promise((resolve, reject) => {
  const success = true;
  success ? resolve("it worked!") : reject(new Error("failed"));
});

// Consuming
promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("always runs"));
```

**Chaining** — each `.then()` returns a new promise:

```js
getUser(1)
  .then((user) => getPosts(user.id))
  .then((posts) => getComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((error) => console.error(error)); // catches any error in the chain
```

**Static methods:**

| Method              | Resolves when    | Rejects when           |
| ------------------- | ---------------- | ---------------------- |
| `Promise.all`       | All fulfill      | Any rejects            |
| `Promise.allSettled` | All settle      | Never                  |
| `Promise.race`      | First settles    | First settles (reject) |
| `Promise.any`       | First fulfills   | All reject             |

### Async/Await

Syntactic sugar over promises. `async` makes a function return a promise. `await` pauses until a promise settles.

```js
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
```

**Error handling with try/catch:**

```js
async function safeFetch(url) {
  try {
    const data = await fetch(url);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
```

**Sequential vs parallel:**

```js
// Sequential — each waits for the previous
const user = await getUser(1);
const posts = await getPosts(user.id);

// Parallel — start all at once, await together
const [user, posts, comments] = await Promise.all([
  getUser(1),
  getPosts(1),
  getComments(1),
]);
```

**Retry pattern:**

```js
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetch(url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
```

**Common mistakes:**

```js
// Forgetting await — logs a Promise, not data
const data = fetch("/api"); // missing await!

// forEach doesn't await — use for...of instead
items.forEach(async (item) => {
  await process(item); // fire-and-forget!
});

// Fix:
for (const item of items) {
  await process(item);
}
```

---

## Quick Reference

| Concept | Key Point |
|---------|-----------|
| `const`/`let` over `var` | Block-scoped, no hoisting surprises |
| `===` over `==` | No type coercion |
| Arrow functions | Concise, no own `this` |
| Destructuring | Extract values cleanly from objects/arrays |
| `?.` and `??` | Safe property access, null-only defaults |
| Closures | Functions remember their creation scope |
| `classList` | Toggle visual state without overwriting classes |
| Event delegation | One listener on parent catches all children |
| `Promise.all` | Parallel async, fails fast |
| `async`/`await` | Clean async syntax, use `try`/`catch` for errors |
