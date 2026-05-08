const item1 = {
  name: "hoa",
  price: 100,
  inStock: false,
};
const item2 = {
  name: "la",
  price: 200,
  inStock: true,
};
const item3 = {
  name: "canh",
  price: 150,
  inStock: false,
};
const item4 = {
  name: "nhuy",
  price: 250,
  inStock: true,
};
const item5 = {
  name: "than",
  price: 500,
  inStock: true,
};
const products = [item1, item2, item3, item4, item5];
const first = products[0];
console.log(first.name);
const second = products[1];
second.price = 150;
console.log(products);
const item6 = {
  name: "re",
  price: 400,
  inStock: false,
};
products.push(item6);
console.log(products);
products.pop();
console.log(products);
products.forEach((value, index) => {
  console.log(value.name);
});
const newProducts = products.map((value) => {
  return value.price;
});
console.log(newProducts);
const stock = products.filter((value) => {
  return value.inStock === true;
});
console.log(stock);
for (let key in item1) {
  console.log(key);
}
