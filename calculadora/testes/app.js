
'use strict';

const crypto    = require('crypto');
const fs        = require('fs');
const moment    = require('moment');
const puppeteer = require('puppeteer');

const app_server_url = process.env.APP_SERVER_URL || 'http://localhost';
const app_user       = process.env.APP_LOGIN_USER || 'root@localhost';
const app_password   = process.env.APP_LOGIN_PASSWORD || 'ligero';
const browser_headless   = process.env.BROWSER_HEADLESS && process.env.BROWSER_HEADLESS.match(/(true|1)/);
const show_browser_console_log = process.env.SHOW_BROWSER_CONSOLE_LOG && process.env.SHOW_BROWSER_CONSOLE_LOG.match(/(true|1)/)
process.env.APP_RESULTS_BASE_PATH = process.env.APP_RESULTS_BASE_PATH || '/app/screenshots';
const defaultNavigationTimeout = 90000;

(async () => {

	// 
	// Initialize puppeteer
	//
	const browser = await puppeteer.launch({
		defaultViewport: null,
		headless: browser_headless,
		args: [
		  "--disable-gpu",
		  "--disable-dev-shm-usage",
		  "--no-sandbox",
		  "--disable-setuid-sandbox",
		  "--disable-popup-blocking",
		  '--window-size=1920,800',
		]
	});
	let pages = await browser.pages();
	await pages[0].close();
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout( defaultNavigationTimeout );

	if(show_browser_console_log) {
		page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
	}

	// set SIGINT to close server on Ctrl+c
	process.on('SIGINT', function() {
		console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
		// some other closing procedures go here
		process.exit(1);
	});
	//
	// Generate unique id to run all tests
	//
	process.env.TEST_ID = process.env.TEST_ID || crypto.randomBytes(20).toString('hex');
	console.log( `Current Test ID: ${process.env.TEST_ID}` );

	//
	// Load test directory
	//
	var testName;
	var scenarios = fs.readdirSync( __dirname + "/scenarios/" );
	// Check if we want to run only specific scenarios
	if(process.env.SCENARIOS){
		let scenariosArg = process.env.SCENARIOS.split(',');
		if(scenariosArg.length){
			var newScenarios = [];
			for (let scenario of scenarios){
				const scenarioNumber = ''+parseInt( scenario.match(/[0-9]+/g)); // replace all leading non-digits with nothing
				if (scenarioNumber.length && scenariosArg.includes(scenarioNumber)){
					newScenarios.push(scenario);
				}
			}
			scenarios = newScenarios;
		}
	}
	let runScenario = () => {
		if (scenarios.length) {
			let testDir = scenarios.shift();
			console.log("[", testDir,"]");
			let tests   = fs.readdirSync( __dirname + "/scenarios/" + testDir );
			let runTest = async () => {
				if (tests.length) {
					testName = tests.shift();
					const testNumber = parseInt( testName.match(/[0-9]+/g)); // replace all leading non-digits with nothing
					console.log(`Test Number ${testNumber}`);
					if(process.env.STEPS){
						if (process.env.STEPS && !steps.includes(testNumber.toString())) {
							await runTest();
							return;
						}
					}

					let test     = require( __dirname + "/scenarios/" + testDir + "/" + testName );
					let t0       = moment().valueOf() / 1000;
					try {
						console.log(" >> Running",testName,"...");
						test( page, (err) => { 
							let t1 = ((moment().valueOf() / 1000) - t0).toFixed(3);
							console.log("OK",t1,"second(s)");
							setTimeout( runTest, 3000 );
						});
					} catch(e) {
						let t1 = ((moment().valueOf() / 1000) - t0).toFixed(3);
						await page.screenshot({path: `${app_results_basepath}/screenshots/screenshot-${testName}-${process.env.TEST_ID}.png`});
						console.log(e,t1,"second(s)");
						process.exit(1);
					}
				} else {
					runScenario();
				}
			};
			runTest();
		} else {
			(async () => await browser.close())();
			process.exit(0);
		}
	};
	runScenario();
})();
