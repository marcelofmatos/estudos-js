
'use strict';

module.exports = (page, cb) => {
	(async () => {
		await page.goto(`https://marcelomatos.dev/estudos-www/calculadora/`, {waitUntil: 'networkidle0'});
		await page.type('#CampoA', '144');
		await page.type('#CampoB', '12');
		await page.click('.caixa button:nth-child(4)');
		await page.$eval('#Resultado', (element, value) => element.value = value, '12');
		cb();
	})();
};
