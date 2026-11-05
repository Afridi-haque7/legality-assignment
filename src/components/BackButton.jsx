import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  // "default" means the page was opened directly, so there's no in-app page to go back to
  const handleBack = () => {
    if (location.key === "default") navigate("/");
    else navigate(-1);
  };

  return (
    <Button onClick={handleBack} className={className}>
      ← Back
    </Button>
  );
}

export default BackButton;
