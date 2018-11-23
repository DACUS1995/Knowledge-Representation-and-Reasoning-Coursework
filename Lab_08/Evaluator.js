//@ts-check

const Utils = require("./Utils");

class Evaluator
{
	constructor()
	{
	}

	/**
	 * @param {Object} objInputObject
	 */
	static evaluate(objInputObject)
	{
		const objCliqueGraph = Evaluator.buildCliqueTree(objInputObject);
	}

	static buildCliqueTree(objInputObject)
	{
		objInputObject = JSON.parse(JSON.stringify(objInputObject));
		const objGraph = Evaluator.DirectToUndirect(objInputObject.graph);

		// Step 1 - Moralize the graph
		for(const strNode of Object.keys(objInputObject.nodes))
		{
			const arrParents = objInputObject.nodes[strNode].parents;

			for(const strFirstParent of arrParents)
			{
				for(const strSecondParent of arrParents)
				{
					if(strFirstParent === strSecondParent)
					{
						continue;
					}
					else
					{
						if(!objGraph[strFirstParent].includes(strSecondParent))
						{
							objGraph[strFirstParent].push(strSecondParent);
						}

						if(!objGraph[strSecondParent].includes(strFirstParent))
						{
							objGraph[strSecondParent].push(strFirstParent)
						}
					}
				}
			}
		}
		Utils.printObject(objGraph);


		// Step 2 - Triangulate
		const arrNodes = Object.keys(objGraph);
		const objScore = {};

		// Sort the nodes by number of edges that need to te be added due to its elimination
		for(const strNode of arrNodes)
		{
			let nCounter = 0;
			const arrNeighbours = objGraph[strNode];

			for(let i = 0; i < arrNeighbours.length - 1; i++)
			{
				for(let j = i + 1; j < arrNeighbours.length; j++)
				{
					if(!objGraph[arrNeighbours[i]].includes(arrNeighbours[j]))
					{
						nCounter++;
					}
				}
			}

			objScore[strNode] = nCounter;
		}

		arrNodes.sort((strNodeA, strNodeB) => {
			return objScore[strNodeA] - objScore[strNodeB];
		});


		const arrMarked = [];
		const objNewGraph = Utils.copyObject(objGraph);
		for(let strNode of arrNodes)
		{
			const arrNeighbours = objGraph[strNode];
			console.log(arrMarked);

			for(let i = 0; i < arrNeighbours.length - 1; i++)
			{
				for(let j = i + 1; j < arrNeighbours.length; j++)
				{
					if(
						!objNewGraph[arrNeighbours[i]].includes(arrNeighbours[j]) 
						&& !arrMarked.includes(arrNeighbours[i])
						&& !arrMarked.includes(arrNeighbours[j])
					)
					{
						objNewGraph[arrNeighbours[i]].push(arrNeighbours[j]);
						objNewGraph[arrNeighbours[j]].push(arrNeighbours[i]);
					}
				}
			}

			arrMarked.push(strNode);
		}

		// Step 3 - Create Maximal Clique Graph (Bron Kerbosch)

		// Step 4 - Create Clique Tree (Min weight span tree)
	}

	static runBeliefPropagation()
	{
		throw new Error("Must be implemented");
	}

	static DirectToUndirect(objGraph)
	{
		const objNewGraph = {};

		for(const strNode of Object.keys(objGraph))
		{
			if(strNode in objNewGraph)
			{
				objNewGraph[strNode] = new Set([...objGraph[strNode], ...objNewGraph[strNode]]);
			}
			else
			{
				objNewGraph[strNode] = new Set(objGraph[strNode]);
			}

			for(const strChild of objNewGraph[strNode])
			{
				if(!(strChild in objNewGraph))
				{
					objNewGraph[strChild] = new Set();
				}
				objNewGraph[strChild].add(strNode);
			}
		}

		Object.keys(objNewGraph).map((strNode => {
			objNewGraph[strNode] = [...objNewGraph[strNode]];
		}));

		return objNewGraph;
	}
}

module.exports = Evaluator;
