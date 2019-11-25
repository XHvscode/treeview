// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MyTreeDataProvider, MyTreeItem } from './treeItem';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "dyplugin" is now active!');
    const provider = new MyTreeDataProvider(vscode.workspace.rootPath as string)
    vscode.window.registerTreeDataProvider("treeItems", provider);
    vscode.commands.registerCommand("tree.delete", (node: MyTreeItem) => provider.delete(node));
    vscode.commands.registerCommand("tree.open", (node: MyTreeItem) => provider.open(node));
}

// this method is called when your extension is deactivated
export function deactivate() { }
