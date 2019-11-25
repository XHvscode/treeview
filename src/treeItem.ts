import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

function lightRes(filename: string) {
    return path.join(__filename, "..", "..", "res", "light", filename);
}

function darkRes(filename: string) {
    return path.join(__filename, "..", "..", "res", "dark", filename);
}

export class MyTreeItem extends vscode.TreeItem {
    //提供一个parent，当它是null时则代表它是根节点
    constructor(public readonly label: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState, public parent: MyTreeItem | null) {
        super(label, collapsibleState);
    }

    //提供一个path的get方法用于获取路径，如果是根节点则就是当前的label，否则还要加上父节点的
    get path(): string {
        return this.parent ? path.join(this.parent.path, this.label) : this.label;
    }

    //对文件和文件夹进行分类 如果collapsibleState是None则代表它是文件
    iconPath = {
        light: this.collapsibleState === vscode.TreeItemCollapsibleState.None ? lightRes("dependency.svg") : lightRes("folder.svg"),
        dark: this.collapsibleState === vscode.TreeItemCollapsibleState.None ? darkRes("dependency.svg") : darkRes("folder.svg"),
    };

    contextValue = this.collapsibleState === vscode.TreeItemCollapsibleState.None ? "fileItems" : "dirItems";

}

export class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {

    constructor(public rootDir: string) { }

    //当发生改变后进行刷新UI
    private _onDidChangeTreeData: vscode.EventEmitter<MyTreeItem | undefined> = new vscode.EventEmitter<MyTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: MyTreeItem): vscode.TreeItem {
        return element;
    }

    // 获取子节点
    getChildren(element?: MyTreeItem | undefined): vscode.ProviderResult<MyTreeItem[]> {
        //当element不存在，则代表它是根节点，这时我们把this.rootDir设进去，并且让它默认展开
        if (!element) {
            return Promise.resolve([new MyTreeItem(this.rootDir, vscode.TreeItemCollapsibleState.Expanded, null)]);
        }
        let items: MyTreeItem[] = [];
        let subfiles = fs.readdirSync(element.path);
        subfiles.forEach(file => {
            let stat = fs.statSync(path.join(element.path, file));
            items.push(new MyTreeItem(file, (stat.isDirectory() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None), element))
        });
        return Promise.resolve(items);
    }

    delete(element: MyTreeItem) {
        let path = element.path;
        let stat = fs.statSync(path);
        if (stat.isDirectory()) {
            exec('rm -rf "' + path + '"');
        }
        else {
            fs.unlinkSync(path);
        }
        this.refresh();
    }

    open(element: MyTreeItem) {
        vscode.window.showTextDocument(vscode.Uri.file(element.path));
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
