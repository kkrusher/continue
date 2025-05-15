import ClineLogoVariable from "@webview-ui/assets/ClineLogoVariable";
import HeroTooltip from "@webview-ui/components/common/HeroTooltip";

const HomeHeader = () => {
  return (
    <div className="mb-5 flex flex-col items-center">
      <div className="my-5">
        <ClineLogoVariable className="size-16" />
      </div>
      <div className="flex items-center justify-center text-center">
        <h2 className="m-0 text-[var(--vscode-font-size)]">
          {"What can I do for you?"}
        </h2>
        <HeroTooltip
          placement="bottom"
          className="max-w-[300px]"
          content={
            "I can develop software step-by-step by editing files, exploring projects, running commands, and using browsers. I can even extend my capabilities with MCP tools to assist beyond basic code completion."
          }
        >
          <span
            className="codicon codicon-info ml-2 cursor-pointer"
            style={{
              fontSize: "14px",
              color: "var(--vscode-textLink-foreground)",
            }}
          />
        </HeroTooltip>
      </div>
    </div>
  );
};

export default HomeHeader;
