# Trainning JS

## Object

- Object:
  - Property: Key-value pair, key là chuỗi, value là bất kỳ kiểu dữ liệu nào
  - Method: Function là thành viên của object

- Cấu trúc: Lưu trữ dữ liệu dưới dạng cặp key-value (khóa-giá trị)
- Key: Thường là chuỗi (string) hoặc symbol, dùng để định danh từng thuộc tính
- Value: Có thể là bất kỳ kiểu dữ liệu nào (string, number, array, object, function...)
- Truy cập: Dùng obj.key hoặc obj["key"]
- Thứ tự: Không đảm bảo thứ tự (trước ES2015), mặc dù ES2015+ duy trì thứ tự chèn cho key dạng string

### Cách tạo Object

- Object Literal (cách phổ biến nhất)
- VD:
  var Car = {};
  // hoặc
  var Car = {
  brand: "Toyota",
  model: "Camry",
  year: 2023
  };

- Sử dụng new Object()
- VD:
  var Car = new Object();
  Car.brand = "Honda";
  Car.model = "City";

- Sử dụng Constructor Function
- VD:
  function Person(name, age) {
  this.name = name;
  this.age = age;
  }
  var person = new Person("Giang", 25);

### Cách truy cập property

- Dot notation (.)

  console.log(student.name); // "Giang Nguyễn"
  console.log(student.age); // 25

- Bracket notation ([])

  console.log(student["name"]); // "Giang Nguyễn"
  console.log(student["city"]); // "Đà Nẵng"
  // Dùng khi key có khoảng trắng hoặc biến
  var key = "age";
  console.log(student[key]); // 25

- VD:
  const student = {
  // Properties (thuộc tính)
  name: "Giang Nguyễn",
  age: 25,
  city: "Đà Nẵng",
  hobbies: ["đọc sách", "code", "chơi game"],
  // Method (phương thức)
  introduce: function() {
  return "Xin chào, tôi là " + this.name;
  },
  // Method dạng shorthand (ES6+)
  sayAge() {
  return "Tôi " + this.age + " tuổi";
  }
  };

### Dùng Object khi nào

--> Khi bạn cần mô tả một thực thể (entity) có nhiều thuộc tính

--> Khi thứ tự không quan trọng

--> Khi cần định danh rõ ràng cho từng giá trị bằng key

--> Khi làm việc với dữ liệu từ API, JSON

--> Khi xây dựng ứng dụng hướng đối tượng (OOP)

## Array

- Cấu trúc: Lưu trữ dữ liệu theo thứ tự trong một biến duy nhất
- Index: Các phần tử được đánh số từ 0, truy cập bằng chỉ số numériques
- Value: Có thể chứa nhiều kiểu dữ liệu khác nhau
- Truy cập: Dùng arr[index]
- Thuộc tính đặc biệt: Có thuộc tính length tự động cập nhật số phần tử

- VD:
  const fruits = ["táo", "cam", "chuối"];
  console.log(fruits[0]); // "táo"
  console.log(fruits.length); // 3
