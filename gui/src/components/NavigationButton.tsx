import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "../util/navigation";

const NavContainer = styled.nav`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--vscode-editor-background);
  border-bottom: 1px solid var(--vscode-panel-border);
  display: flex;
  justify-content: space-between;
`;

const NavLinksLeft = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLinksRight = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavLink = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  background-color: ${(props) => (props.active ? "#2563eb" : "#e5e7eb")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  transition: all 0.2s;
`;

const AgentNavButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 500;
  background-color: ${(props) => (props.active ? "#007acc" : "#333")};
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#005fa3" : "#444")};
  }
`;

type NavigationButtonProps = {
  openSettings?: () => void;
  openHistory?: () => void;
  openMcp?: () => void;
  openChat?: () => void;
  showSettings?: boolean;
  showHistory?: boolean;
  showMcp?: boolean;
  showChat?: boolean;
};

const NavigationButton = ({
  openSettings,
  openHistory,
  openMcp,
  openChat,
  showSettings = false,
  showHistory = false,
  showMcp = false,
  showChat = true,
}: NavigationButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage =
    location.pathname === ROUTES.HOME || location.pathname === "/";
  const isClinePage = location.pathname === ROUTES.CLINE_PAGE;

  return (
    <NavContainer>
      <NavLinksLeft>
        <NavLink active={isHomePage} onClick={() => navigate(ROUTES.HOME)}>
          Act Mode
        </NavLink>
        <NavLink
          active={isClinePage}
          onClick={() => navigate(ROUTES.CLINE_PAGE)}
        >
          Agent Mode
        </NavLink>
      </NavLinksLeft>

      {isClinePage && (
        <NavLinksRight>
          <AgentNavButton active={showChat} onClick={openChat}>
            Chat
          </AgentNavButton>
          <AgentNavButton active={showSettings} onClick={openSettings}>
            Settings
          </AgentNavButton>
          <AgentNavButton active={showHistory} onClick={openHistory}>
            History
          </AgentNavButton>
          <AgentNavButton active={showMcp} onClick={openMcp}>
            MCP
          </AgentNavButton>
        </NavLinksRight>
      )}
    </NavContainer>
  );
};

export default NavigationButton;
