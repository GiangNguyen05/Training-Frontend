import { useDemNguoc } from "../hook/DemNguoc";
function DemNguocDai() {
  const { giay, daBD, batDau, reset } = useDemNguoc(30);

  return (
    <div className="card">
      <p className="label"> Đếm ngược 30 giây</p>
      <p className={`count ${giay <= 5 && daBD ? "do" : ""}`}>{giay}s</p>
      <div className="btns">
        <button onClick={batDau} disabled={daBD || giay === 0}>
          Bắt đầu
        </button>
        <button className="outline" onClick={reset}>
          Reset
        </button>
      </div>
      {giay === 0 && <p className="done"> Xong!</p>}
    </div>
  );
}
export default DemNguocDai;
