"use strict";
// @ts-check

const Parser = require("./Parser");
const Evaluator = require("./Evaluator");

class Main
{
	constructor()
	{}

	static async run()
	{
		const strFileName = process.argv[2] || "input.txt";
		
		const objInputObject = await Parser.loadAndParse(strFileName);
		Evaluator.evaluate(objInputObject);
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
