// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');

require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

const client = axios.create({
  headers: {
    Authorization: "Bearer " + apiKey,
  },
});
console.log('API Key:', apiKey);

async function activate(context) {

	console.log('Congratulations, your extension "auto-code-documentation" is now active!');

	let disposable = vscode.commands.registerCommand('auto-code-documentation.extension', async () => {
		const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        const selectedCode = editor.document.getText(selection);
        // Check if any code is selected
        if (selectedCode.trim() === '') {
          vscode.window.showErrorMessage('No code selected!');
          return;
      }
        // Logic to generate documentation from selectedCode
        const documentation = await generateDocumentation(selectedCode);

        // Display the generated documentation in a new editor tab
        vscode.workspace.openTextDocument({ content: documentation, language: 'markdown' }).then(document => {
            vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
        });
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

async function generateDocumentation(selectedCode) {
  const params= {
    model: "text-davinci-003",
       prompt:`Generate comprehensive documentation for the following code:\n\n${selectedCode}. Provide descriptions for functions, classes, and variables.
       Explain the purpose and usage of each function and class.`,
         
          max_tokens: 500,
          temperature: 1,
      };
      try {
        const response = await client.post("https://api.openai.com/v1/completions", params);
      return response.data.choices[0].text;

    } catch (error) {
        console.error('Error generating documentation:', error);
        return 'Error generating documentation.';
    }

}