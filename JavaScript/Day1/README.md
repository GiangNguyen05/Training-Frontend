# Trainning JS

## Khai báo biến:

- var : phạm vi rộng không hạn chế (kh nên dùng)
- let : giống var nhưng phạm vi trong func, khai báo ở đâu dùng ở đó. cs thể khai báo nhưng không gắn giá trị.
- const : hằng số. kh thể thay đổi giá trị gán cho nó. khai báo phải gắn giá trị.
- Ví dụ: const age = 25;
  age= 30;
  consolog.log(age) erro

- Kiểu dữ liệu:
- Object: key-value
- Ví dụ const person = {
  name : "giang",
  age : "26"
  }

## Toán tử trong js

- Toán tử số học
  b=a++ : b=a tức là b bằng a rồi mới +(lúc này b = a +1);
  b= ++a : b=a+! tức là + trực tiếp trước rồi mới gán.
- Toán tử so sánh
  == so sánh giá trị
  === ss giá trị và datatypeof

## console.log()

- Thông nên cộng chuỗi (name: giang , age: 26) : sử dụng dấu phẩy.
- Ví dụ: console.log("name: "+ name + ", age" + age)
  Nên: console.log("name:", name, ", age",name)
  Tô màu cho chuỗi dùng %c
  Ví dụ console.log("%c STOP", "color:red; font-weight: bold")

## Sử dụng biến số khi khai báo: `${}` (phải có dấu ``)

const name = ${};

## Khác nhau giữa vòng lặp while và dowhile

- while: ktra ddkien trước khi chạy

- dowhile: chạy tối thiểu một lần rồi ktra đkien
