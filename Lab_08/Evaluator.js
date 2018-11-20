//@ts-check

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
		for(const strNode of objInputObject)
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

		// Step 2 - Triangulate
		

		// Step 3 - Create Clique Graph

		// Step 4 - Create Clique Tree (Min weight span tree)
	}

	static runBeliefPropagation()
	{
		throw new Error("Must be implemented");
	}

	static DirectToUndirect(objGraph)
	{
		throw new Error("Must be implemented");
	}
}

module.exports = Evaluator;
