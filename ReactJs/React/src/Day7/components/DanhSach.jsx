function DanhSach({ items }) {
  if (items.length === 0) return <p className="empty">Không tìm thấy.</p>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
export default DanhSach;

//LSU
