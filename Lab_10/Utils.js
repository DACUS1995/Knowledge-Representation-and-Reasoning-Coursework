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
}

module.exports = Utils;
