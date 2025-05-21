import { useEffect, useRef, useState } from "react";
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

  @media (max-width: 600px) {
    position: relative;
  }
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

  @media (max-width: 600px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: #333;
  border: none;
  color: white;
  cursor: pointer;

  @media (max-width: 600px) {
    display: block;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  flex-direction: column;
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 0.25rem;
  z-index: 10;
  margin-top: 0.5rem;
  width: 150px;
`;

const DropdownItem = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  text-align: left;
  background-color: ${(props) => (props.active ? "#007acc" : "transparent")};
  color: ${(props) => (props.active ? "white" : "var(--vscode-foreground)")};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.active ? "#005fa3" : "var(--vscode-list-hoverBackground)"};
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--vscode-panel-border);
  }
`;

type NavigationProps = {
  openSettings?: () => void;
  openHistory?: () => void;
  openMcp?: () => void;
  openChat?: () => void;
  showSettings?: boolean;
  showHistory?: boolean;
  showMcp?: boolean;
  showChat?: boolean;
};

const Navigation = ({
  openSettings,
  openHistory,
  openMcp,
  openChat,
  showSettings = false,
  showHistory = false,
  showMcp = false,
  showChat = true,
}: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHomePage =
    location.pathname === ROUTES.HOME || location.pathname === "/";
  const isClinePage = location.pathname === ROUTES.CLINE_PAGE;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <NavLinksRight ref={dropdownRef}>
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

          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>☰</MenuButton>

          <DropdownMenu isOpen={menuOpen}>
            <DropdownItem
              active={showChat}
              onClick={() => {
                if (openChat) openChat();
                setMenuOpen(false);
              }}
            >
              Chat
            </DropdownItem>
            <DropdownItem
              active={showSettings}
              onClick={() => {
                if (openSettings) openSettings();
                setMenuOpen(false);
              }}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              active={showHistory}
              onClick={() => {
                if (openHistory) openHistory();
                setMenuOpen(false);
              }}
            >
              History
            </DropdownItem>
            <DropdownItem
              active={showMcp}
              onClick={() => {
                if (openMcp) openMcp();
                setMenuOpen(false);
              }}
            >
              MCP
            </DropdownItem>
          </DropdownMenu>
        </NavLinksRight>
      )}
    </NavContainer>
  );
};

export default Navigation;
