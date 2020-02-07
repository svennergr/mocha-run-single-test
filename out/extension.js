"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "test-from-contextmenu" is now active!');
    // save for later
    let terminal;
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("extension.runTest", () => {
        // The code you place here will be executed every time your command is executed
        // current editor
        const editor = vscode.window.activeTextEditor;
        const fullFile = editor.document.fileName;
        const path = fullFile.substring(0, fullFile.lastIndexOf("\\") + 1);
        const fileName = fullFile.replace(path, '');
        const testFileName = fullFile.replace('\\src\\', '\\build\\');
        // check if there is no selection
        const testName = editor.document.getText(editor.selection);
        if (!terminal) {
            terminal = vscode.window.createTerminal('Test Terminal');
        }
        terminal.show();
        terminal.sendText(`cd ${path}..\\..`);
        terminal.sendText(`gulp build; mocha -g '${testName}' ${testFileName} --exit`);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map