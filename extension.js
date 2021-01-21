// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const clipboardy = require('clipboardy');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	

	// new vscode.Location(vscode.window.activeTextEditor.document.uri,new vscode.Position(0, 0));
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "getfn" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('getfn.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from getFn!');
	});

	let guojihua = vscode.commands.registerCommand('guojihua', function() {
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let text = document.getText();
		// console.log(text);
		let reg = /(\$t\().+(\))/g
		let arr = text.match(reg);
		// console.log(String(arr))
		// let str = String(arr);
		if(!arr) {
			return false;
		}
	
		let tempArr = [];
		for(let i = 0; i < arr.length; i++) {
			let item = arr[i];
			let reg = /(\$t)|(\()|(\))/g
			let temp = item.replace(reg, '');
			// console.log(temp);
			tempArr.push(temp);
		}
		console.log(tempArr);
		let obj = {};

		let keyArr = [];
		tempArr.forEach(ele => {
			if(!ele.includes('@')) {
				return false;
			}
			let temp = ele.split('@');
			let id =   Number(Math.random().toString().substr(3) + Date.now()).toString(36);
			if(temp.length> 1) {
				keyArr.push(temp[0])
				id = temp[0].replace(/(')/g, '');
			
			}
				
					obj[id] = ele;
				
		})

		if(keyArr.length <= 0) {
			return false;
		}

		if(keyArr.length != [...new Set(keyArr)].length) {
			const key = keyArr.filter((ele, index) => {
				return keyArr.indexOf(ele) != index;
			})
			vscode.window.showInformationMessage('存在重复的名称', key.toString())
			return false;
		}
		let temp = '';
		console.log(obj);
		let objStr = '';
		for(let key in obj) {
			let value = obj[key];
			let temp = value.split('@')[1] || value;
			objStr = `${objStr}'${key}':${temp},`
			let reg  = new RegExp(value)
			
			 temp = text.replace(reg, `'${key}'`);
			text = temp;
		}
		vscode.commands.executeCommand('editor.action.selectAll').then(() => {
		
			const selection = editor.selection
			editor.edit(builder => {

				builder.replace(selection, text)
			})
			clipboardy.writeSync(objStr);
		});
		// console.log(temp);
	})

	

	

	context.subscriptions.push(disposable);
	context.subscriptions.push(guojihua)
	 
	
	
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
