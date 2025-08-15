import Button from "./Button";
import { useNavigate } from "react-router";

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        navigate("/app/cities");
      }}
      type="back"
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
