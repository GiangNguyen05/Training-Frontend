# Trainning JS

## Function

### Khái niệm

- function name(para){statements...};
- ()=>{statements...}; anounymos function (function vô danh)

<!-- - function thực thi ngay lập tức:
  - (function(){
    statements...
    })();   -->

- gán một function vô danh vào tên một biến số.
  - const name = ()=>{statement...}

- return: sau khi return kết thúc function. (nếu muốn function dừng lại thì ta dùng return)

### Function Declaration

- function chaoHoi(ten) {
  return "Xin chào " + ten;
  }

### Function Expression

- const chaoHoi = function(ten) {
  return "Xin chào " + ten;
  };

### Arrow Function

- const chaoHoi = (ten) => "Xin chào " + ten;

## Scope

- Scope xác định biến nào có thể truy cập được ở đâu trong code.
  - Phạm vi toàn cục(global scope): cả dự án chạy. ở đâu cũng dùng đc(hạn chế dùng)
  - Phạm vi function (function scope): khai báo func nào sài trong func đó
  - Phạm vi khối (block scope): khai báo biến số trong block giới hạn dấu {}
- Note: code chạy từ trên xuống dưới

### Scope Chain (Chuỗi Scope)

- Hàm con có thể truy cập biến của hàm cha:
- VD:
  - function hamCha() {
    const ten = "React";
    function hamCon() {
    console.log(ten); // Truy cập được biến của hamCha
    }
    hamCon();
    }

### Closure

- Closure là khi hàm con "nhớ" biến của hàm cha dù hàm cha đã chạy xong:

- function taoBodem() {
  let dem = 0; // Biến này được "đóng gói" lại
  return function() {
  dem++;
  return dem;
  };
  }
  const bodem = taoBodem();
  console.log(bodem()); // 1
  console.log(bodem()); // 2
  console.log(bodem()); // 3

- Note:
  Hàm cha chạy xong
  ↓
  Biến bình thường → bị xóa khỏi bộ nhớ
  Biến được closure dùng → được GIỮ LẠI
  ↓
  Hàm con vẫn truy cập được mãi mãi

### Hoisting

- var và function declaration được "kéo lên đầu" trước khi chạy:

- console.log(x); // undefined (không lỗi vì var được hoist)
  var x = 5;
  chaoHoi(); // Chạy được dù khai báo ở dưới
  function chaoHoi() {
  console.log("Xin chào!");
  }

// let và const KHÔNG được hoist

- console.log(y); // Lỗi
  let y = 10;

- Note: let và const vẫn được hoiting nhưng được đưa vào cùng chết.

## Tóm tắt

- Khái niệm -------------> Ý nghĩa
- Function --------------> Khối code tái sử dụng
- Global Scope ----------> Biến dùng được ở mọi nơi
- Function Scope --------> Biến chỉ sống trong function
- Block Scope -----------> let/const chỉ sống trong {}
- Closure ---------------> Hàm con nhớ biến của hàm cha
- Hoisting --------------> var(undefined) và function được đưa lên đầu
