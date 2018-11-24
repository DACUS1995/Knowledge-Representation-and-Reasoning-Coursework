//@ts-check

const assert = require("assert").strict;

class Sets
{
	constructor()
	{
		throw new Error("Should not be instantiated!");
	}

	static union(setA, setB)
	{
		[setA, setB] = Sets.checkSet(setA, setB);

		const setUnion = new Set(setA);

		for(let elem of setB)
		{
			setUnion.add(elem);
		}

		return setUnion;
	}

	static intersection(setA, setB)
	{
		[setA, setB] = Sets.checkSet(setA, setB);

		const setIntersection = new Set();

		for(let elem of setA)
		{
			if(setB.has(elem))
			{
				setIntersection.add(elem);
			}
		}

		return setIntersection;
	}

	static difference(setA, setB)
	{
		[setA, setB] = Sets.checkSet(setA, setB);

		const setDifference = new Set(setA);

		for(let elem of setB)
		{
			setDifference.delete(elem);
		}

		return setDifference;
	}

	static checkSet(...arrSets)
	{
		assert.ok(arrSets.length, "The passed Set is not usable.");

		for(let nIndex in arrSets)
		{
			arrSets[nIndex] = arrSets[nIndex] instanceof Set ? arrSets[nIndex] : new Set(arrSets[nIndex]);
		}

		return arrSets;
	}
}

module.exports = Sets;
