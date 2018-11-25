//@ts-check

const Utils = require("./Utils");
const Sets = require("./Sets");

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
		console.log(arrNodes);

		const arrMarked = [];
		const objNewGraph = Utils.copyObject(objGraph);

		for(let nIndex in arrNodes)
		{
			const objScore = {};

			// First count the number of edges that have to be added when removing a node
			for(const strInnerNode of arrNodes)
			{
				if(arrMarked.includes(strInnerNode))
				{
					continue;
				}

				let nCounter = 0;
				const arrNeighbours = objGraph[strInnerNode];
	
				for(let i = 0; i < arrNeighbours.length - 1; i++)
				{
					// Make sure we dont count the eliminated nodes
					if(arrMarked.includes(arrNeighbours[i]))
					{
						continue;
					}
	
					for(let j = i + 1; j < arrNeighbours.length; j++)
					{
						if(arrMarked.includes(arrNeighbours[j]))
						{
							continue;
						}
	
						if(!objGraph[arrNeighbours[i]].includes(arrNeighbours[j]))
						{
							nCounter++;
						}
					}
				}
	
				objScore[strInnerNode] = nCounter;
			}

			const arrSortedNodes = Object.keys(objScore);
			arrSortedNodes.sort((strNodeA, strNodeB) => {
				if(objScore[strNodeA] - objScore[strNodeB] !== 0)
				{
					return objScore[strNodeA] - objScore[strNodeB];
				}
				else
				{
					return objGraph[strNodeA].length - objGraph[strNodeB].length;
				}
			});


			// Select the node with the smallest score to process
			const strNode = arrSortedNodes[0];
			const arrNeighbours = objGraph[strNode];

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
		const arrCliques = [];
		Evaluator.BronKerbosch(
			/*R*/ new Set(), 
			/*P*/ new Set(Object.keys(objNewGraph)), 
			/*X*/ new Set(), 
			arrCliques,
			objNewGraph
		);
		// console.log(arrCliques);
		
		const arrVertexMap = arrCliques;
		let arrCliqueGraph = Array.from(new Array(arrVertexMap.length));
		arrCliqueGraph = arrCliqueGraph.map((elem) => {
			return [];
		});

		// Create the actual graph of cliques
		for(let nIndex = 0; nIndex < arrVertexMap.length; nIndex++)
		{
			const setCurrentClique = arrVertexMap[nIndex];
			console.log(nIndex);

			for(let i = nIndex + 1; i <= arrVertexMap.length; i++)
			{
				const setCommon = Sets.intersection(setCurrentClique, arrVertexMap[i]);

				if(setCommon.size !== 0)
				{
					arrCliqueGraph[nIndex].push({
						"dest": i,
						"weight": setCommon.size,
						"common": [...setCommon]
					});

					arrCliqueGraph[i].push({
						"dest": nIndex,
						"weight": setCommon.size,
						"common": [...setCommon]
					});
				}
				else
				{
					continue;
				}
			}
		}

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

	static BronKerbosch(R, P, X, arrCliques, objGraph)
	{
		[R, P, X] = Sets.checkSet(R, P, X);

		if(P.size === 0 && X.size === 0)
		{
			console.log(":: Clique found");
			console.log(R);
			arrCliques.push(R);
		}

		for(let strNode of P)
		{
			Evaluator.BronKerbosch(
				/*R*/ Sets.union(R, strNode),
				/*P*/ Sets.intersection(P, objGraph[strNode]),
				/*X*/ Sets.intersection(X, objGraph[strNode]),
				arrCliques,
				objGraph
			)

			P = Sets.difference(P, strNode);
			X = Sets.union(X, strNode);
		}
	}
}

module.exports = Evaluator;
