import { memo } from "react";

const NutBam = memo(function NutBam({ label, onClick }) {
  console.log(`NutBam "${label}" re-render`);
  return <button onClick={onClick}>{label}</button>;
});

export default NutBam;
