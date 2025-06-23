import "../style.css";

const Button = ({ icon, name, onClick }) => {
  return (
    <div className="button" onClick={onClick}>
      <span className="button-icon">{icon}</span>
      <span className="button-text">{name}</span>
    </div>
  );
};

export default Button;
