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
		objInputObject.queries = [];
		objInputObject.results = [];
		objInputObject.graph = {};

		const strFileContents = await FileLoader.readFile(strFileName);

		let arrLines = strFileContents.split("\n");

		const arrFirstLine = arrLines[0].split(" ")
		objInputObject.numberOfNodes = parseInt(arrFirstLine[0], 10)
		objInputObject.numberOfQueries = parseInt(arrFirstLine[1], 10)

		arrLines = arrLines.map(row => row.replace(/ |\r/g,''));

		// Each Variable Loading
		for(let i = 1; i < objInputObject.numberOfNodes + 1; i++)
		{
			const arrRow = arrLines[i].split("");
			const [strNode, ...arrParents] = arrRow;
			objInputObject.nodes[strNode] = arrParents;

			arrParents.map(node => {
				if(Array.isArray(objInputObject.graph[node]))
				{
					objInputObject.graph[node].push(strNode);	
				}
				else
				{
					objInputObject.graph[node] = [strNode];
				}
			})
		}

		// Queries
		for(let i = objInputObject.numberOfNodes + 1; i < objInputObject.numberOfNodes + objInputObject.numberOfQueries + 1; i++)
		{
			const strRow = arrLines[i];
			const arrRow = strRow.split(/;|\|/g);

			const X = arrRow[0].split("");
			const Y = arrRow[1].split("");
			const Z = arrRow[2].split("");
			objInputObject.queries.push({X, Y, Z});
		}

		// Results
		for (let i = objInputObject.numberOfNodes + objInputObject.numberOfQueries + 1; i < objInputObject.numberOfNodes + 2 * objInputObject.numberOfQueries + 1; i++)
		{
			const strRow = arrLines[i];
			objInputObject.results.push(strRow === "true");
		}

		console.log("----------------------------------");
		console.log(JSON.stringify(objInputObject, null, 4));
		console.log("----------------------------------\n");

		return objInputObject;
	}
}

module.exports = Parser;
