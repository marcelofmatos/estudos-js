
'use strict';

module.exports = (page, cb) => {
	(async () => {
		await page.goto(`https://marcelomatos.dev/estudos-www/calculadora/`, {waitUntil: 'networkidle0'});
		await page.type('#CampoA', '144');
		await page.click('.caixa button:nth-child(5)');
		await page.$eval('#Resultado', (el, value) => el.value = value, '12');
		cb();
	})();
};
