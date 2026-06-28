function Field({ label, error, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
export default Field;
