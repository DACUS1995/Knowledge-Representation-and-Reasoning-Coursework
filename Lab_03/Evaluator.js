const Op = require("./Operators");
const ValueStore = require("./values.json");

class Evaluator
{
	constructor(arrParsedFormulas)
	{
		this._arrParsedFormulas = arrParsedFormulas;
		this._arrExpandedFormulas = JSON.parse(JSON.stringify(arrParsedFormulas));
		this._arrAllFormulas = [{}];

		this._arrResults = null;

		this._objVariablePool = {};

		this._bFoundSolution = false;
		this._objSolution = null;
	}

	applyMethod()
	{
		this._applyRules();
		this.printResults();
		
		// There should be just one expression
		this.evaluate(this._arrExpandedFormulas[0]);
	}
	

	evaluate(objExpression)
	{
		const strStartingWorld = "W0";

		const bResult = this.visitNode(objExpression, strStartingWorld);
		console.log("Result is: " + bResult);
	}

	visitNode(objExpression, strCurrentWorld)
	{
		if(typeof objExpression === "string")
		{
			return ValueStore[strCurrentWorld].Values[objExpression];
		}

		if(objExpression.op === Op.NEC.name)
		{
			if(ValueStore[strCurrentWorld].Destination.length === 0)
			{
				return false;
			}

			return ValueStore[strCurrentWorld].Destination.reduce((acc, strWorldName) => {
				return acc && this.visitNode(objExpression.expR, strWorldName);
			}, true);
		}

		if(objExpression.op === Op.POS.name)
		{
			if(ValueStore[strCurrentWorld].Destination.length === 0)
			{
				return false;
			}

			return ValueStore[strCurrentWorld].Destination.reduce((acc, strWorldName) => {
				return acc || this.visitNode(objExpression.expR, strWorldName);
			}, true);
		}

		if(objExpression.op === Op.NOT.name)
		{
			return !(this.visitNode(objExpression.expR, strCurrentWorld));
		}

		if(objExpression.op === Op.AND.name)
		{
			return this.visitNode(objExpression.expL, strCurrentWorld) && this.visitNode(objExpression.expR, strCurrentWorld);
		}

		if(objExpression.op === Op.OR.name)
		{
			return this.visitNode(objExpression.expL, strCurrentWorld) || this.visitNode(objExpression.expR, strCurrentWorld);
		}

		throw new Error(`Reached end with op: ${objExpression.op}`);
	}


	_applyRules(nFormulaIndex = 0)
	{
		const objCurrentFormula = this._arrExpandedFormulas[nFormulaIndex];
		this._visitNode(objCurrentFormula);
	}

	_visitNode(objExpressionNode)
	{
		// Safety check
		if(typeof objExpressionNode === "string")
		{
			return;
		}

		const strCurrentOp = objExpressionNode.op;
		// console.log("Op:" + JSON.stringify(objExpressionNode, null, 4));
		console.log(strCurrentOp);
		
		if(Op[strCurrentOp].type === "unary" && Op[strCurrentOp].name === Op.NOT.name)
		{
			// Check if the operand is a terminal node
			if(typeof objExpressionNode.expR === "string")
			{
				this._objVariablePool[objExpressionNode.expR] = true;
			}
			else
			{
				switch (objExpressionNode.expR.op) 
				{
					case "NOT":
						objExpressionNode = this._Rule_NON_NON_A(objExpressionNode);
						this._visitNode(objExpressionNode);
						return;
					case "AND":
						this._Rule_NON_A_AND_B(objExpressionNode);
						this._visitNode(objExpressionNode);
						return;
					case "OR":
						this._Rule_NON_A_OR_B(objExpressionNode);
						this._visitNode(objExpressionNode);
						return;
					case "IMP":
						this._Rule_NON_A_IMP_B(objExpressionNode);
						this._visitNode(objExpressionNode);
						return;
					case "EQI":
						this._Rule_NON_A_EQI_B(objExpressionNode);
						this._visitNode(objExpressionNode);
						return;
				}
				this._visitNode(objExpressionNode.expR);
			}
		}
		
		if(Op[strCurrentOp].type === "unary" && Op[strCurrentOp].name === Op.NEC.name)
		{
			this._visitNode(objExpressionNode.expR);
		}

		if(Op[strCurrentOp].type === "unary" && Op[strCurrentOp].name === Op.POS.name)
		{
			this._visitNode(objExpressionNode.expR);
		}

		if(Op[strCurrentOp].type === "binary")
		{
			switch(Op[strCurrentOp].name)
			{
				case "IMP":
					this._Rule_A_IMP_B(objExpressionNode);
					this._visitNode(objExpressionNode);
					return;
				case "EQI":
					this._Rule_A_EQI_B(objExpressionNode);
					this._visitNode(objExpressionNode);
					return;
			}

			// Check if the operands are a terminal node
			if(typeof objExpressionNode.expL === "string")
			{
				this._objVariablePool[objExpressionNode.expL] = true;
			}
			else
			{
				this._visitNode(objExpressionNode.expL);
			}

			// Check if the operand is a terminal node
			if(typeof objExpressionNode.expR === "string")
			{
				this._objVariablePool[objExpressionNode.expR] = true;
			}
			else
			{
				this._visitNode(objExpressionNode.expR);
			}
		}
	}

	_Rule_A_IMP_B(objNode)
	{
		console.log("_Rule_A_IMP_B");
		objNode.op = Op.OR.name;

		objNode.expL = {
			op: Op.NOT.name,
			expR: objNode.expL
		};
	}

	_Rule_A_EQI_B(objNode)
	{
		console.log("_Rule_A_EQI_B");
		const oldExpL = objNode.expL;
		const oldExpR = objNode.expR;

		objNode.op = Op.OR.name;

		objNode.expL = {
			op: Op.AND.name,
			expL: oldExpL,
			expR: oldExpR
		};

		objNode.expR = {
			op: Op.AND.name,
			expL: {
				op: Op.NOT.name,
				expR: oldExpL
			},
			expR: {
				op: Op.NOT.name,
				expR: oldExpR
			}
		};
	}

	_Rule_NON_NON_A(objNode)
	{
		console.log("_Rule_NON_NON_A");
		objNode.op = Op.AND.name;
		objNode.expL = objNode.expR.expR;;
		objNode.expR = objNode.expR.expR;;
		return objNode;
	}

	_Rule_NON_A_AND_B(objNode)
	{
		console.log("_Rule_NON_A_AND_B");
		const oldExpL = objNode.expR.expL;
		const oldExpR = objNode.expR.expR;

		objNode.op = Op.OR.name;

		objNode.expL = {
			op: Op.NOT.name,
			expR: oldExpL
		};

		objNode.expR = {
			op: Op.NOT.name,
			expR: oldExpR
		};
	}

	_Rule_NON_A_OR_B(objNode)
	{
		console.log("_Rule_NON_A_OR_B");
		const oldExpL = objNode.expR.expL;
		const oldExpR = objNode.expR.expR;

		objNode.op = Op.AND.name;

		objNode.expL = {
			op: Op.NOT.name,
			expR: oldExpL
		};

		objNode.expR = {
			op: Op.NOT.name,
			expR: oldExpR
		};
	}

	_Rule_NON_A_IMP_B(objNode)
	{
		console.log("_Rule_NON_A_IMP_B");
		const oldExpL = objNode.expR.expL;
		const oldExpR = objNode.expR.expR;

		objNode.op = Op.AND.name;

		objNode.expL = oldExpL;

		objNode.expR = {
			op: Op.NOT,
			expR: oldExpR
		};
	}

	_Rule_NON_A_EQI_B(objNode)
	{
		console.log("_Rule_NON_A_EQI_B");
		const oldExpL = objNode.expR.expL;
		const oldExpR = objNode.expR.expR;

		objNode.op = Op.OR.name;

		objNode.expL = {
			op: Op.AND.name,
			expL: oldExpL,
			expR: {
				op: Op.NOT.name,
				expR: oldExpR
			}
		};

		objNode.expR = {
			op: Op.AND.name,
			expL: {
				op: Op.NOT,
				expR: oldExpL
			},
			expR: oldExpR
		};
	}

	printResults()
	{
		console.log("---> After the rules were applied:");
		// console.log(Object.keys(this._objVariablePool));
		for(let objExpandedExpression of this._arrExpandedFormulas)
		{
			console.log("----------------------------------");
			console.log(JSON.stringify(objExpandedExpression, null, 4));
			console.log("----------------------------------\n");
		}
	}

	cleanResults(arrResults)
	{
		const arrNewArray = [];

		for(let i = 0; i < arrResults.length; i++)
		{
			if(arrResults[i] === null)
			{
				continue;
			}

			arrNewArray.push(arrResults[i]);
			
		}

		if(arrNewArray.length === 1)
		{
			return null;
		}

		return arrNewArray;
	}
}

module.exports = Evaluator;
