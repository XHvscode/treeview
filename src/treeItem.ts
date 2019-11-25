import * as vscode from 'vscode';
import * as path from 'path';


function lightRes(filename: string) {
    return path.join(__filename, "..", "..", "res", "light", filename);
}

function DarkRes(filename: string) {
    return path.join(__filename, "..", "..", "res", "dark", filename);
}

export class MyTreeItem extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
        super(label, collapsibleState);
    }

    iconPath = {
        light: path.join(__filename, "..", "..", "res", "light", "dependency.svg"),
        dark: path.join(__filename, "..", "..", "res", "dark", "dependency.svg")
    }
}

export class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
    onDidChangeTreeData?: vscode.Event<MyTreeItem | null | undefined> | undefined; getTreeItem(element: MyTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        throw new Error("Method not implemented.");
    }
    getChildren(element?: MyTreeItem | undefined): vscode.ProviderResult<MyTreeItem[]> {
        throw new Error("Method not implemented.");
    }
}