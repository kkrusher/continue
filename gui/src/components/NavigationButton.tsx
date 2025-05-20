import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "../util/navigation";

const NavContainer = styled.nav`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  background-color: ${(props) => (props.active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#2563eb" : "#e5e7eb")};
  }
`;

const NavigationButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage =
    location.pathname === ROUTES.HOME || location.pathname === "/";
  const isClinePage = location.pathname === ROUTES.CLINE_PAGE;

  return (
    <NavContainer>
      <NavLink active={isHomePage} onClick={() => navigate(ROUTES.HOME)}>
        Act mode
      </NavLink>
      <NavLink active={isClinePage} onClick={() => navigate(ROUTES.CLINE_PAGE)}>
        Agent Mode
      </NavLink>
    </NavContainer>
  );
};

export default NavigationButton;
