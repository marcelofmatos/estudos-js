
'use strict';

module.exports = (page, cb) => {
	(async () => {
		await page.goto(`https://marcelomatos.dev/estudos-www/calculadora/`, {waitUntil: 'networkidle0'});
		await page.type('#CampoA', 144);
		await page.click('.caixa button:nth-child(5)')
		cb();
	})();
};
