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
        const arrQueries = objInputObject.queries;
        const arrResults = [];

        for(let index in arrQueries)
        {
            const query = arrQueries[index];
            const arrZ = query.Z;

            let arrParents = [];

            const objCopyInput = JSON.parse(JSON.stringify(objInputObject));

 
            // console.log("----------------------------------");
            // console.log(JSON.stringify(objCopyInput.graph, null, 4));
            // console.log("----------------------------------\n");


            
            console.log("---------------------");
            console.log(objCopyInput.graph);
            console.log("---------------------");
        }
        console.log(arrResults);
    }

    
    static mapParents(objParentNodes, arrParents, Z)
    {
        if(objParentNodes[Z].length != 0)
        {
            arrParents = objParentNodes[Z].reduce((acc, val) => {
                return [...acc, Evaluator.mapParents(objParentNodes, [], val)]
            }, objParentNodes[Z]);
        }

        return arrParents;
    }
}

module.exports = Evaluator;
