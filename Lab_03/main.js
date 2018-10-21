"use strict";
// @ts-check

const Parser = require("./Parser");
const Evaluator = require("./Evaluator");

class Main
{
	constructor()
	{
	}

	static async run()
	{
		const strFileName = process.argv[2] || "input.txt";
		
		const parser = new Parser(strFileName);
		await parser.processFile();
        parser.printAllFormulas();
        
        const evaluator = new Evaluator(parser.parsedFormulas);
        evaluator.applyMethod();

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
	.catch(err => console.log(err));

