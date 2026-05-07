//global scope
let global = "ten cua toi";
function name() {
  console.log(global);
}
name();
//func scope
function show() {
  let myName = "Ging";
  console.log(myName);
}
show();
// console.log(myName); //loi
//block scope
//Lab02:

// function tinhTrungBinh(toan, van, anh) {
//   let sum = toan + van + anh;
//   return sum / 3;
// }
// let diemTrungBinh = tinhTrungBinh(9, 8, 7);

const tinhTrungBinh = (toan, van, anh) => {
  return (toan + van + anh) / 3;
};
const xepLoai = (diemTB) => {
  if (diemTB >= 9) {
    return "xuat sac";
  } else if (diemTB >= 8 && diemTB < 9) {
    return "gioi";
  } else if (diemTB >= 6.5 && diemTB < 8) {
    return "kha";
  } else {
    return "trung binh";
  }
};
const diemToan = 9;
const diemVan = 7;
const diemAnh = 8;
const result = tinhTrungBinh(diemToan, diemVan, diemAnh);
console.log(`
    diem trung binh: ${result}
    xep loai: ${xepLoai(result)}`);
