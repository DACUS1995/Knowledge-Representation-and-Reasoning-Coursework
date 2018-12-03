//@ts-check

const Utils = require("./Utils");
const Factor = require("./Factor");
const Sets = require("./Sets");

class BeliefPropagation
{
	/**
	 * @param {Array} arrCliqueTree 
	 * @param {Object} objInputObject 
	 * @param {Array} arrCliques 
	 */
	constructor(arrCliqueTree, objInputObject, arrCliques)
	{
		this._arrCliqueTree = arrCliqueTree;
		this._objInputObject = objInputObject
		this._arrCliques = arrCliques;
	}

	runSteps()
	{
		this.allocateFactors();
		this.incorporateEvidence();
		this.choseRoot();
		this.propagateMessagesUp();
		this.propagateMessagesDown();
	}

	allocateFactors()
	{
		// First compute factors for each variable
		this._variableFactors = {};
		this._cliquesFactors = [];

		for(let strVariable of Object.keys(this._objInputObject.nodes))
		{
			const objCurrentNode = this._objInputObject.nodes[strVariable];
			const arrProbs = [];
			for(let i = 0; i < objCurrentNode.CPD.length; i++)
			{
				arrProbs[i] = objCurrentNode.CPD[i];
				arrProbs[objCurrentNode.CPD.length + i] = (1 - arrProbs[i]).toFixed(2);
			}

			this._variableFactors[strVariable] = new Factor(
				arrProbs.length, 
				arrProbs, 
				[...[strVariable], ...objCurrentNode.parents]
			);
		}

		const arrCliques = Utils.copyObject(this._arrCliques);
		const arrFactors = Object.values(this._variableFactors);

		for(let nIndex = 0; nIndex < arrCliques.length; nIndex++)
		{
			const arrClique = arrCliques[nIndex];
			const setCurrentClique = new Set(arrClique);
			
			for(let j = 0; j < arrFactors.length; j++)
			{
				const objCurrentFactor = arrFactors[j];
				const setCurrentFactor = new Set(objCurrentFactor._arrValues);

				if(Sets.intersection(setCurrentClique, setCurrentFactor).size === setCurrentFactor.size)
				{
					if(this._cliquesFactors[nIndex] instanceof Factor)
					{
						this._cliquesFactors[nIndex] = this._cliquesFactors[nIndex].multiply(objCurrentFactor);
					}
					else
					{
						this._cliquesFactors[nIndex] = objCurrentFactor;
					}

					arrFactors.splice(j, 1);
					j--;
				}
			}
		}

		Utils.printObject(this._cliquesFactors);
	}

	incorporateEvidence()
	{

	}

	propagateMessagesUp()
	{
		const newCurrentGraph = [];

		// Add a return edge for every existing one
		for(let i = 0; i < this._arrCliqueTree.length; i++)
		{
			const currentEdge = this._arrCliqueTree[i];
			if(newCurrentGraph[currentEdge.src])
			{
				newCurrentGraph[currentEdge.src].dest.push({
					common: currentEdge.common,
					node: currentEdge.dest
				});
			}
			else
			{
				newCurrentGraph[currentEdge.src] = {
					dest: [{
						common: currentEdge.common,
						node: currentEdge.dest
					}],
					variables: this._arrCliques[currentEdge.src],
					factors: this._cliquesFactors[currentEdge.src]
				};
			}


			if(newCurrentGraph[currentEdge.dest])
			{
				newCurrentGraph[currentEdge.dest].dest.push({
					common: currentEdge.common,
					node: currentEdge.src
				});
			}
			else
			{
				newCurrentGraph[currentEdge.dest] = {
					dest: [{
						common: currentEdge.common,
						node: currentEdge.src
					}],
					variables: this._arrCliques[currentEdge.dest],
					factors: this._cliquesFactors[currentEdge.dest]
				};
			}
		}

		console.log(newCurrentGraph);

		// Give each node a rank
		const arrRank = [];
		for(let i = 0; i < newCurrentGraph.length; i++)
		{
			arrRank.push(-1);
		}

		arrRank[this.root] = 0;
		this.createRank(this.root, newCurrentGraph, arrRank);

		// Propagate messages bassed on rank
		for(let nRank = Math.max(...arrRank); nRank >= 0; nRank--)
		{
			for(let node = 0; node < arrRank.length; node++)
			{
				if(arrRank[node] == nRank && node !== this.root)
				{
					for(let objDestNode of newCurrentGraph[node].dest)
					{
						this.sendMessage(newCurrentGraph[node].factors, newCurrentGraph[objDestNode.node].facators, newCurrentGraph[node].common)
					}
				}
			}
		}
	}

	propagateMessagesDown()
	{

	}

	sendMessage(factorOne, factorTwo, arrCommon)
	{

	}

	createRank(currentNode, graph, arrRank)
	{
		console.log("visiting node:" + currentNode);
		for(let neighbor of graph[currentNode].dest)
		{
			if(arrRank[neighbor.node] == -1)
			{
				arrRank[neighbor.node] = arrRank[currentNode] + 1;
				this.createRank(neighbor.node, graph, arrRank);
			}
		}

		return;
	}

	choseRoot()
	{
		this.root = 0;
	}
}

module.exports = BeliefPropagation;
