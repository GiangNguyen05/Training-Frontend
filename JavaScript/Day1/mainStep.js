// const name = "Giang";
// let age;
// console.log(name, age);

// const person = {
//   myName: "Giang",
//   myAge: "26",
// };
// console.log(person);

// const score = [10, 5, 9, 7, 6];
// console.log(score);

// let a = 10,
//   b = 20,
//   c = 30;

console.log(a++, ++b, a); // a=10, b=11, a=11

const introduction = "name: " + name + " age " + person.myAge;
console.log(introduction);
// = với khai báo khi sử dụng dấu `${}`
const intro = `name: ${name}  age: ${person.myAge}` + `${name}`;
console.log(intro);

// Template literals (backticks) allow for multi-line strings and embedded expressions
const fullName = `Nguyen Van Giang`;
let birthYear = 2000;
let isStudent = false;
const today = new Date();
const currentYear = today.getFullYear();
const calculatedAge = currentYear - birthYear;
console.log(today);
console.log(currentYear);
// console.log(fullName);
// console.log(calculatedAge);
// console.log(isStudent);
console.log(`
    ${fullName} 
    ${calculatedAge} 
    ${isStudent}
    `);
