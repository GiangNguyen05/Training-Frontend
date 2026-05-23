class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} tạo ra âm thanh`;
  }
}

// Dog kế thừa Animal
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // gọi constructor của Animal
    this.breed = breed; // thêm property riêng
  }

  // Override method của class cha
  speak() {
    return `${this.name} sủa: Gâu gâu!`;
  }
  // Method riêng của Dog
  fetch() {
    return `${this.name} (${this.breed}) đi lấy bóng!`;
  }
}

const myDog = new Dog("Rex", "Husky");
console.log(myDog.speak()); // "Rex sủa: Gâu gâu!"
console.log(myDog.fetch()); // "Rex (Husky) đi lấy bóng!"
console.log(myDog instanceof Dog); // true
console.log(myDog instanceof Animal); // true — cũng là Animal!
console.log("================================================");

// Private
//  Private — chỉ truy cập được bên trong class
class BankAccount {
  #balance = 0; // private!

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount();
acc.deposit(500);
console.log(acc.getBalance()); // 500
// acc.#balance → Error!
console.log("============================================");

// Static
// static — thuộc về class, không phải object.
class MathHelper {
  // Dùng thẳng qua class
  // không cần new
  static square(n) {
    return n * n;
  }

  static cube(n) {
    return n * n * n;
  }
}

MathHelper.square(4); // 16
MathHelper.cube(3); // 27
// new MathHelper() không cần
console.log("================================================");
// Polymorphism — nhiều class cùng tên method nhưng hành vi khác nhau. Code gọi chung một interface, từng object tự xử lý theo cách riêng.
class Shape {
  area() {
    return 0;
  }
  toString() {
    return `Diện tích: ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(r) {
    super();
    this.r = r;
  }
  area() {
    return Math.PI * this.r ** 2;
  }
}

class Rectangle extends Shape {
  constructor(w, h) {
    super();
    this.w = w;
    this.h = h;
  }
  area() {
    return this.w * this.h;
  }
}

class Triangle extends Shape {
  constructor(b, h) {
    super();
    this.b = b;
    this.h = h;
  }
  area() {
    return 0.5 * this.b * this.h;
  }
}

// Gọi chung một interface — mỗi shape tự tính theo cách riêng
const shapes = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 8)];

shapes.forEach((s) => console.log(s.constructor.name, "→", s.toString()));
