// @ts-check

const FileLoader = require("./FileLoader");
const Utils = require("./Utils");

class Parser
{
	constructor()
	{
	}

	static async loadAndParse1(strFileName)
	{
		const objInputObject = {};
		objInputObject.nodes = {};
		objInputObject.graph = {};
		const arrQueries = [];

		const strFileContents = await FileLoader.readFile(strFileName);
		let arrLines = strFileContents.split("\n");

		const [nGraphLines, nQueries] = arrLines[0].split(" ").map(el => parseInt(el));

		for(let i = 1; i <= nGraphLines; i++)
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

				// Undirected
				// if(Array.isArray(objInputObject.graph[strVariable]))
				// {
				// 	objInputObject.graph[strVariable].push(node);	
				// }
				// else
				// {
				// 	objInputObject.graph[strVariable] = [node];
				// }
			})
		}

		for(let i = nGraphLines + 1; i <= nGraphLines + nQueries; i++)
		{
			const [strFirstPart, strSecondPart] = arrLines[i].split(" | ");

			let arrChildren = strFirstPart.trim().split(" ");
			arrChildren = arrChildren.map(el => {
				const[strVariable, nValue] = el.split("=");
				return {
					variable: strVariable,
					value: parseInt(nValue)
				};
			});

			let arrParents = [];
			if(strSecondPart !== undefined)
			{
				arrParents = strSecondPart.trim().split(" ");
				arrParents = arrParents.map(el => {
					const[strVariable, nValue] = el.split("=");
					return {
						variable: strVariable,
						value: parseInt(nValue)
					};
				});
			}

			arrQueries.push({
				children: arrChildren,
				parents: arrParents
			});
		}

		return {objInputObject, arrQueries};
	}

	/**
	 * @param {string} strFileName 
	 */
	static async loadAndParse2(strFileName)
	{
		const objInputObject = {};
		objInputObject.samples = {};
		objInputObject.variables = null;

		const strFileContents = await FileLoader.readFile(strFileName);

		let arrLines = strFileContents.split("\n");

		const arrVariables = arrLines[0].trim().split(" ");
		objInputObject.variables = arrVariables;

		objInputObject.variables.forEach(strVariable => {
			objInputObject.samples[strVariable] = [];
		});

		// Each Variable Loading
		for(let i = 1; i < arrLines.length; i++)
		{
			const strCurrentLine = arrLines[i];
			const arrSamples = strCurrentLine.trim().split(" ");

			arrSamples.forEach((strSample, index) => {
				objInputObject.samples[objInputObject.variables[index]].push(parseInt(strSample));
			});
		}

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
