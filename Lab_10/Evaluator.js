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
	static evaluate(arrSamples, objInputObject)
	{
		Utils.printObject(arrSamples, false, "arrSamples");
		// Utils.printObject(objInputObject, false, "objInputObject");

		// const result = Evaluator.search(
		// 	arrSamples, 
		// 	{
		// 		child: {J: 1},
		// 		cond: {A: 0, H: 1}
		// 	}
		// );

		// Utils.printObject(objInputObject.objInputObject);

		for(let el in objInputObject.objInputObject.nodes)
		{
			const child = {[el]: 1};
			const cond = {};
			const curObj = objInputObject.objInputObject.nodes[el];
			
			let arrComb = generateCombinations(curObj.parents.length);
			if(curObj.parents.length == 0)
			{
				arrComb = [[]];
			}
			
			for(let l = 0; l < arrComb.length / 2; l++)
			{
				for(let j = 0; j < curObj.parents.length; j++)
				{
					const parent = curObj.parents[j];
					cond[parent] = arrComb[l][j];
				}

				if(Object.values(cond).length > 1)
				{
					const result = Evaluator.search(arrSamples, {
						child: child,
						cond: cond
					});


					console.log(child);
					console.log(cond);
					console.log(result);
					console.log("-----------");
				}
			}

		}
	}

	static search(arrSamples, objQuery)
	{
		let nom = 0;
		let den = 0;

		for(let j = 0; j < arrSamples.samples["A"].length; j++)
		{
			let valid = true;
			for(let variable in objQuery.cond)
			{
				if(objQuery.cond[variable] !== arrSamples.samples[variable][j])
				{
					valid = false;
				}
			}
			if(valid)
			{
				den++;
			}

			const newObj = {...objQuery.cond, ...objQuery.child};
			valid = true;
			for(let variable in newObj)
			{
				if(newObj[variable] !== arrSamples.samples[variable][j])
				{
					valid = false;
				}
			}
			if(valid)
			{
				nom++;
			}
		}

		const result = nom/den;
		// console.log("Result: " + result);
		return result;
	}	
		
}

function generateCombinations(nVariables)
{
	let arrTemp = [];
	for(let i = 0; i < nVariables; i++)
	{
		arrTemp.push([0,1]);
	}

	arrTemp = Utils.cartesian(...arrTemp);
	return arrTemp;
}

module.exports = Evaluator;
