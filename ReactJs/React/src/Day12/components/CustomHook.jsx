import DemNguocNgan from "./DemNguocNgan";
import DemNguocDai from "./DemNguocDai";
import "../styles/style.css";
export default function CustomHook() {
  return (
    <div className="wrap">
      <h2>Custom Hook</h2>
      <p className="sub">
        useDemNguoc: dùng ở 2 nơi — mỗi nơi có state riêng độc lập
      </p>

      <DemNguocNgan />
      <DemNguocDai />
    </div>
  );
}
