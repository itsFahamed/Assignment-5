1️. Difference between var, let, and const

var → Old way to declare variables. Function-scoped and can be redeclared and updated.

let → Block-scoped. Can be updated but not redeclared in the same scope.

const → Block-scoped. Cannot be updated or redeclared after declaration.

2️. What is the spread operator (...)?

The spread operator is used to expand elements of an array or object into another array/object.

Example:
let arr2 = [...arr1];

3️. Difference between map(), filter(), and forEach()

map() → Creates a new array by transforming each element.

filter() → Creates a new array with elements that pass a condition.

forEach() → Just loops through the array, but does not return a new array.

4️. What is an arrow function?

An arrow function is a shorter way to write a function in JavaScript using =>.

Example:
const add = (a, b) => a + b;

5️. What are template literals?

Template literals allow you to write strings with variables and multiple lines easily using backticks ( ).

Example:
`Hello ${name}`