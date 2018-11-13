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

            for(let Z of arrZ)
            {
                // Mark all parents of Z
                arrParents = Evaluator.mapParents(objCopyInput.nodes, arrParents, Z);
                arrParents.push(Z);

                arrParents = arrParents.filter(el => !Array.isArray(el));

                arrParents.forEach(element => {

                    // console.log(element);
                    // console.log(objCopyInput.nodes[element]);

                    // Check if the node has at least 2 parents
                    if(objCopyInput.nodes[element].length > 1)
                    {
                        const arrCurentParents = objCopyInput.nodes[element];

                        for(let m = 0; m < arrCurentParents.length; m++)
                        {
                            for(let n = 0; n < arrCurentParents.length; n++)
                            {
                                if(m == n)
                                {
                                    continue; // skip the same parent node
                                }

                                if(objCopyInput.graph[arrCurentParents[m]].includes(arrCurentParents[n]))
                                {
                                    continue; // skip if the nodes are allready in array
                                }

                                objCopyInput.graph[arrCurentParents[m]].push(arrCurentParents[n]);
                            }
                        }
                        // objCopyInput.nodes[element].forEach(element2 => {
                        // });

                    }
                });
            }

            // console.log("----------------------------------");
            // console.log(JSON.stringify(objCopyInput.graph, null, 4));
            // console.log("----------------------------------\n");

            Evaluator.thirdCase(objCopyInput.graph, arrZ);

            let bValue = true;
            for(let currentX of query.X)
            {
                bValue = bValue && Evaluator.runGraph(objCopyInput.graph, arrZ, query.Y, currentX, []);
            }
            
            console.log("---------------------");
            console.log(objCopyInput.graph);
            console.log("---------------------");
            arrResults.push(bValue);
        }
        console.log(arrResults);
    }


    static runGraph(objGraph, arrZ, arrY, currentX, arrVisited)
    {
        let bTruthValue = true;

        if(!Object.keys(objGraph).includes(currentX))
        {
            return true;
        }


        // allready visited
        if(arrVisited.includes(currentX))
        {
            return true;
        }

        arrVisited.push(currentX);

        for(let el of objGraph[currentX])
        {
            if(arrZ.includes(el))
            {
                continue;
            }

            if(arrY.includes(el))
            {
                return false;
            }

            bTruthValue = bTruthValue && Evaluator.runGraph(objGraph, arrZ, arrY, el, arrVisited);
        }

        return bTruthValue;
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

    static thirdCase(objGraph, arrZ)
    {
        const arrNodes = ["A", "B", "C", "D"];

        for(let el of arrNodes)
        {
            if(!arrZ.includes(el))
            {
                if(Array.isArray(objGraph[el]))
                {
                    if(objGraph[el].length == 2)
                    {
                        if(!objGraph[objGraph[el][1]])
                        {
                            objGraph[objGraph[el][1]] = [];
                        }

                        if(!objGraph[objGraph[el][0]])
                        {
                            objGraph[objGraph[el][0]] = [];
                        }

                        objGraph[objGraph[el][0]].push(objGraph[el][1]);
                        objGraph[objGraph[el][1]].push(objGraph[el][0]);
                    }
                }
            }
        }
    }
}

module.exports = Evaluator;
