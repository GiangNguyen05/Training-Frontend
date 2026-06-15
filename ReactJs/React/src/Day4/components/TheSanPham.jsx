function TheSanPham({ sp, onXoa }) {
  return (
    <div className="card">
      <div>
        <p className="ten">{sp.ten}</p>
        <p className="gia">{sp.gia.toLocaleString()} đ</p>
        {!sp.conHang && <span className="het">Hết hàng</span>}
      </div>
      <button onClick={() => onXoa(sp.id)}>Xóa</button>
    </div>
  );
}
export default TheSanPham;
