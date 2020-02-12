"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const path = require("path");
const vscode = require("vscode");

// this method is called when your extension is activated
let terminal;
function activate(context) {
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal(closedTerminal => {
      if (closedTerminal == terminal) {
        terminal = null;
      }
    })
  );
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.debugTest", () => {
      const debugPort = 9228;
      executeRunTest(9228);
      // start a debug console that attaches automatically to the test we just started in debug mode
      vscode.debug.startDebugging("", {
        type: "node",
        request: "attach",
        name: "Attach",
        port: debugPort,
        skipFiles: ["<node_internals>/**"]
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runTest", () => {
      executeRunTest();
    })
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map

const executeCommandsInTerminal = (...commands) => {
  if (!terminal) {
    terminal = vscode.window.createTerminal("[Mocha Test Terminal]");
  }
  terminal.show();

  commands.forEach(command => {
    terminal.sendText(command);
  });
};

const executeRunTest = debugPort => {
  // current editor
  const editor = vscode.window.activeTextEditor;
  const document = editor.document;
  const fullFile = document.fileName;
  const filePath = path.dirname(fullFile).replace(/\\/g, "/");
  // const fileName = path.basename(filePath);
  const testFileName = fullFile.replace(/\\/g, "/").replace("/src/", "/build/");

  let testName;
  testName = document.getText(editor.selection);
  if (!testName) {
    const lineText = document.lineAt(editor.selection.start.line);
    const testNameMatch = lineText.text.match(/\'.*\'/g).pop();
    // remove leading and trailing ' from name
    testName = testNameMatch.substring(1, testNameMatch.length - 1);
  }

  const cdWorkDirCommand = `cd ${filePath}../..`;

  let debugArgs = debugPort ? `--inspect-brk=${debugPort}` : "";
  const executeTestCommand = `gulp build; mocha ${debugArgs} -g '${testName}' ${testFileName} --exit`;

  executeCommandsInTerminal(cdWorkDirCommand, executeTestCommand);
};
