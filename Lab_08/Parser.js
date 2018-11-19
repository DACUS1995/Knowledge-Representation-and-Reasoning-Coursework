// @ts-check

const FileLoader = require("./FileLoader");

class Parser
{
	constructor()
	{
	}

	/**
	 * @param {string} strFileName 
	 */
	static async loadAndParse(strFileName)
	{
		const objInputObject = {};
		objInputObject.nodes = {};
		objInputObject.graph = {};

		const strFileContents = await FileLoader.readFile(strFileName);

		let arrLines = strFileContents.split("\n");

		// Each Variable Loading
		for(let i = 0; i < arrLines.length; i++)
		{
			const strLine =	arrLines[i];
			const arrComponents = strLine.split(";");

			const strVariable = Parser.cleanString(arrComponents[0]);
			objInputObject.nodes[strVariable] = {};

			// Parents parsing
			const arrParents = Parser.cleanString(arrComponents[1]).split("");
			objInputObject.nodes[strVariable].parents = arrParents;

			// CPD Parsing
			const arrCPDs = arrComponents[2].trim().split(" ");
			objInputObject.nodes[strVariable].CPD = arrCPDs;

			// Creating the graph
			arrParents.map(node => {
				if(Array.isArray(objInputObject.graph[node]))
				{
					objInputObject.graph[node].push(strVariable);	
				}
				else
				{
					objInputObject.graph[node] = [strVariable];
				}
			})
		}

		console.log("----------------------------------");
		console.log(JSON.stringify(objInputObject, null, 4));
		console.log("----------------------------------\n");

		return objInputObject;
	}

	/**
	 * @param {string} strDirty 
	 */
	static cleanString(strDirty)
	{
		return strDirty.replace(/ |\r/g,'')
	}
}

module.exports = Parser;
