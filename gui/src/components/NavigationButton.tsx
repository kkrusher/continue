import { useNavigate } from "react-router-dom";
import { ROUTES } from "../util/navigation";

const NavigationButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ROUTES.NEW_PAGE);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded bg-blue-500 px-4 py-1 text-white transition-colors hover:bg-blue-600"
    >
      前往新页面
    </button>
  );
};

export default NavigationButton;
