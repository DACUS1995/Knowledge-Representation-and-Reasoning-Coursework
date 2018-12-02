//@ts-check

const Utils = require("./Utils");

class BeliefPropagation
{
    /**
     * @param {Array} arrCliqueTree 
     * @param {Object} objInputObject 
     * @param {Array} arrCliques 
     */
    constructor(arrCliqueTree, objInputObject, arrCliques)
    {
        this._arrCliqueTree = arrCliqueTree;
        this._objInputObject = objInputObject
        this._arrCliques = arrCliques;
    }

    runSteps()
    {
        this.allocateFactors();
        this.incorporateEvidence();
        this.propagateMessagesUp();
        this.propagateMessagesDown();
    }

    allocateFactors()
    {
        // First compute factors for each variable
        this._variableFactors = {};

        for(let strVariable of Object.keys(this._objInputObject.nodes))
        {
            // TODO create factors for each variable and then create factors for each clique node
        }
    }

    incorporateEvidence()
    {

    }

    propagateMessagesUp()
    {

    }

    propagateMessagesDown()
    {

    }
}

module.exports = BeliefPropagation;
