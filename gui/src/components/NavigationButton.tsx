import { useNavigate } from "react-router-dom";
import { ROUTES } from "../util/navigation";

const NavigationButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ROUTES.NEW_PAGE);
  };

  return (
    <div className="my-4 flex justify-center">
      <button
        onClick={handleClick}
        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        前往新页面
      </button>
    </div>
  );
};

export default NavigationButton;
