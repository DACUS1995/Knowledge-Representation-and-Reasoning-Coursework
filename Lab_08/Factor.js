//@ts-check

const Utils = require("./Utils");
const Sets = require("./Sets");

class Factor
{
	constructor(nSize, arrProbs, arrValues)
	{
		this._nSize = nSize;
		this._arrProbs = arrProbs;
		this._arrValues = arrValues;

		this._arrInnerValues = Factor.generateCombinations(Math.sqrt(this._nSize));
	}

	multiply(secondFactor)
	{
		if(!(secondFactor instanceof Factor))
		{
			throw new Error("Second element is not a factor");
		}

		const setA = new Set(this._arrValues);
		const setB = new Set(secondFactor._arrValues);
		const setUnion = Sets.union(setA, setB);
		const setIntersection = Sets.intersection(setA, setB);

		const arrProbs = [];
		const arrCombinations = Factor.generateCombinations(setUnion.size);

		for(let _ of arrCombinations)
		{
			arrProbs.push(1);
		}

		for(let i = 0; i < arrCombinations.length; i++)
		{
			for(let j = 0; j < this._arrInnerValues.length; j++)
			{
				let bTruth = true;
				for(let k = 0; k < this._arrValues.length; k++)
				{
					if(arrCombinations[i][k] !== this._arrInnerValues[j][k])
					{
						bTruth = false;
					}
				}

				if(bTruth)
				{
					arrProbs[i] *= this._arrInnerValues._arrProbs[j];
				}
			}
			
			const nOffset = setIntersection.size;
			for(let j = 0; secondFactor._arrInnerValues.length; j++)
			{
				let bTruth = true;
				for(let k = 0; k < this._arrValues.length; k++)
				{
					if(arrCombinations[i][k + nOffset] !== this._arrInnerValues[j][k])
					{
						bTruth = false;
					}
				}

				if(bTruth)
				{
					arrProbs[i] *= this._arrInnerValues._arrProbs[j];
				}
			}
		}

		const newFactor = new Factor(Math.pow(2, setUnion.size), arrProbs, [...setUnion]);
	}

	static generateCombinations(nVariables)
	{
		let arrTemp = [];
		for(let i = 0; i < nVariables; i++)
		{
			arrTemp.push([0,1]);
		}

		arrTemp = Utils.cartesian(...arrTemp);
		return arrTemp;
	}
}

module.exports = Factor;
