// @ts-check

const Utils = require("./Utils");

class KruskalMST
{
    constructor(arrCliqueGraph)
    {
        this._arrCliqueGraph = Utils.copyObject(arrCliqueGraph);
        this._nVertices = arrCliqueGraph.length;
    }

    run()
    {
        const arrResult = [];
        let arrEdgeGraph = [];

        for(let arrEdges of this._arrCliqueGraph)
        {
            arrEdgeGraph = [...arrEdgeGraph, ...arrEdges];
        }

        arrEdgeGraph = arrEdgeGraph.sort((elA, elB) => {
            return elB.weight - elA.weight;
        });

        let i = 0;
        let e = 0;

        const arrParent = [];
        const arrRank = [];

        // Create this._nVertices subsets with single elements
        for(let i = 0; i < this._nVertices; i++)
        {
            arrParent.push(i);
            arrRank.push(0);
        }

        // The number of edges for the Tree is this._nVertices - 1
        while(e < this._nVertices - 1)
        {
            const {src, dest, weight, common} = arrEdgeGraph[i];

            i++;
            const x = KruskalMST.find(arrParent, src);
            const y = KruskalMST.find(arrParent, dest);

            if(x !== y)
            {
                e++;
                arrResult.push({
                    src,
                    dest,
                    weight,
                    common
                });
                KruskalMST.union(arrParent, arrRank, x, y)
            }
        }

        return arrResult;
    }

    static find(arrParent, i)
    {
        if(arrParent[i] == i)
        {
            return i;
        }

        return KruskalMST.find(arrParent, arrParent[i]);
    }

    static union(arrParent, arrRank, x, y)
    {
        const xRoot = KruskalMST.find(arrParent, x);
        const yRoot = KruskalMST.find(arrParent, y);

        if(arrRank[xRoot] < arrRank[yRoot])
        {
            arrParent[xRoot] = yRoot;
        }
        else
        {
            if(arrRank[xRoot] > arrRank[yRoot])
            {
                arrParent[yRoot] = xRoot;
            }
            else
            {
                arrParent[yRoot] = xRoot;
                arrRank[xRoot]++;
            }
        }
    }
}

module.exports = KruskalMST;
