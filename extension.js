// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const OPENAI_API_KEY = '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'; // Replace with your OpenAI API key
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "auto-code-documentation" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('auto-code-documentation.extension', function () {
		const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();

            try {
                const response = axios.post(OPENAI_API_ENDPOINT, {
                    prompt: text,
                    max_tokens: 150, // You can adjust this value based on your requirements
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    }
                });

                const generatedDocumentation = response.data.choices[0].text;
                
                const outputChannel = vscode.window.createOutputChannel('Generated Documentation');
				outputChannel.appendLine(generatedDocumentation);
                outputChannel.show();
            } catch (error) {
                console.error('Error generating documentation:', error);
                vscode.window.showErrorMessage('Error generating documentation. Check the console for details.');
            }
		}
		vscode.window.showInformationMessage('Hello World from Auto Code Documentation!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
