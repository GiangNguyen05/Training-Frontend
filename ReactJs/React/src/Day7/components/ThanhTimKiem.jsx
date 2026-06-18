function ThanhTimKiem({ onThayDoi }) {
  return (
    <input
      className="search"
      placeholder=" Tìm sản phẩm..."
      onChange={(e) => onThayDoi(e.target.value)}
    />
  );
}
export default ThanhTimKiem;

//LSU
