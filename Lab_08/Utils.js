//@ts-check

class Utils
{
    constructor()
    {}

    static copyObject(objObject)
    {
        return JSON.parse(JSON.stringify(objObject));
    }

    static printObject(objInputObject)
    {
        console.log("----------------------------------");
		console.log(JSON.stringify(objInputObject, null, 4));
		console.log("----------------------------------\n");
    }
}

module.exports = Utils;
