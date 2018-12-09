//@ts-check

const Utils = require("./Utils");

class Evaluator
{
	constructor()
	{
	}

	/**
	 * @param {Object} objSamples
	 * @param {Object} objInputObject
	 */
	static evaluate(objSamples, objInputObject)
	{
		const objInput = objInputObject.objInputObject;
		const arrQueries = objInputObject.arrQueries;
		
		const objParams = Evaluator.initializeParams(objInput.nodes);
		// console.log(objParams);
		Evaluator.fit(objSamples.variables, objSamples.samples, objParams)

		Utils.printObject(objParams, false, "RESULTS");
	}

	static fit(arrVariables, arrSamples, objParams)
	{
		// for(let nIndex = 0; nIndex < 10; nIndex++)
		for(let nIndex = 0; nIndex < arrSamples["A"].length; nIndex++)
		{
			console.log(`Sample [${nIndex}]`);
			for(let strVariable of arrVariables)
			{
				const arrParents = objParams[strVariable].parents;
				const arrParentsValue = [];

				for(let strParent of arrParents)
				{
					arrParentsValue.push(arrSamples[strParent][nIndex]);
				}

				const nCPDpos = Utils.binArrToDec(arrParentsValue);
				const theta = objParams[strVariable].CPD[nCPDpos];
				const nGradient = arrSamples[strVariable][nIndex] - Utils.sigmoid(theta)

				objParams[strVariable].CPD[nCPDpos] = Evaluator.round(theta + Evaluator.learningRate * nGradient);
			}
		}
	}

	static initializeParams(objNodes)
	{
		const objParams = {};
		
		for(let strNode in objNodes)
		{
			objParams[strNode] = {
				parents: objNodes[strNode].parents,
				CPD: new Array(Math.pow(2, objNodes[strNode].parents.length)).fill(0).map(el => Evaluator.round(Math.random()))
			};
		}

		return objParams;
	}

	static round(number)
	{
		return Math.round(number * 1000) / 1000;
	}

	static get learningRate(){return 0.003}
}



module.exports = Evaluator;
