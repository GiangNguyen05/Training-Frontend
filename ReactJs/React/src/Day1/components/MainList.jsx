export default function MainList({ imgSrc, title, description }) {
  return (
    <li className="item">
      <img src={imgSrc} alt={title} className="imageAvt" />
      <h2>{title}</h2>
      <p>{description}</p>
    </li>
  );
}
