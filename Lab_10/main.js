"use strict";
// @ts-check

const Parser = require("./Parser");
const Evaluator = require("./Evaluator");
const Utils = require("./Utils");

class Main
{
	constructor()
	{}

	static async run()
	{
		const strFileName1 = process.argv[2] || "bn1.txt";
		const strFileName2 = process.argv[2] || "samples_bn1.txt";
		
		const objInputObject = await Parser.loadAndParse1(strFileName1);
		const arrSamples = await Parser.loadAndParse2(strFileName2);
		Evaluator.evaluate(arrSamples, objInputObject);
	}
}

process.on(
	"unhandledRejection",
	(reason, promise) => {
		console.log("-> unhandledRejection");
		console.log(`Promise: ${promise}, Reason: ${reason.stack}`);

		process.exit(1);
	}
);

process.on(
	"uncaughtException", 
	(error) => {
		console.log("uncaughtException");
		console.error(error);
		
		process.exit(1);
	}
)

Main.run()
	.catch(err => console.error(err));
