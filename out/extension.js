"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const path = require("path");
const vscode = require("vscode");
// this method is called when your extension is activated
function activate(context) {
  let terminal;

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
  let disposable = vscode.commands.registerCommand("extension.runTest", () => {
    // The code you place here will be executed every time your command is executed
    // current editor
    const editor = vscode.window.activeTextEditor;
    const fullFile = editor.document.fileName;

    const filePath = path.dirname(fullFile).replace(/\\/g, "/");
    // const fileName = path.basename(filePath);
    const testFileName = fullFile
      .replace(/\\/g, "/")
      .replace("/src/", "/build/");
    // check if there is no selection
    const testName = editor.document.getText(editor.selection); // TODO: determine this

    if (!terminal) {
      terminal = vscode.window.createTerminal("[Mocha Test Terminal]");
    }
    terminal.show();
    terminal.sendText(`cd ${filePath}..\\..`);
    terminal.sendText(
      `gulp build; mocha -g '${testName}' ${testFileName} --exit`
    );
  });
  context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
