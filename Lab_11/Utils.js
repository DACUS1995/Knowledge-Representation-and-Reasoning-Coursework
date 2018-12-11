//@ts-check

class Utils
{
	constructor()
	{}

	static copyObject(objObject)
	{
		return JSON.parse(JSON.stringify(objObject));
	}

	static printObject(objInputObject, bPretty = false, strMessage = "")
	{
		console.log("----------------------------------");
		console.log(`### ${strMessage} ###`);
		if(!bPretty)
		{
			console.log("----------------------------------");
			console.log(objInputObject);
			console.log("----------------------------------\n");
		}
		else
		{
			console.log("----------------------------------");
			console.log(JSON.stringify(objInputObject, null, 4));
			console.log("----------------------------------\n");
		}
	}

	static _f(a, b)
	{
		return [].concat(...a.map(d => b.map(e => [].concat(d, e))));
	}

	static cartesian(a, b, ...c) 
	{
		return (b ? Utils.cartesian(Utils._f(a, b), ...c) : a);
	}

	/**
	 * Kullback–Leibler divergence of 0 indicates that the two distributions in question are identical
	 * 
	 * @param {Array<number>} distA 
	 * @param {Array<number>} distB 
	 */
	static KLDivergence(distA, distB)
	{
		if(!Array.isArray(distA))
		{
			throw new Error("distA is not an Array");
		}

		if(!Array.isArray(distB))
		{
			throw new Error("distB is not an Array");
		}

		if(distA.length !== distB.length)
		{
			throw new Error("Input probability distributions have different sizes.");
		}

		distA = distA.map(el => el < 0 ? 0.000000001 : el);
		distB = distB.map(el => el < 0 ? 0.000000001 : el);
		let nCrossEntropyResult = 0;

		for(let nIndex = 0; nIndex < distA.length; nIndex++)
		{
			nCrossEntropyResult += distA[nIndex] * Math.log(distA[nIndex] / distB[nIndex]);		
		}

		return nCrossEntropyResult;
	}

	static sigmoid(nInput, diff = false)
	{
		if(typeof nInput !== "number")
		{
			throw new Error(`Input must be a number. Given: ${typeof nInput}`);
		}

		if(diff)
		{
			return Utils.sigmoid(nInput) * (1 - Utils.sigmoid(nInput));
		}
		else
		{
			return 1 / (1 + Math.exp(-nInput));
		}
	}

	static binArrToDec(arrBin)
	{
		if(arrBin.length === 0)
		{
			return 0;
		}
		return parseInt(arrBin.join(""), 2);
	}
}

module.exports = Utils;
