const utils = require('../utils');
const constants_global = require('../constants_global');
const constants = require('./constants');
const levenshtein = require('js-levenshtein');

module.exports = {
	search: async (search, options) => {
		const doc = await utils.search(constants.URL_SEARCH, search);
		const objects_scrapped = module.exports.scrap_link(doc, search);
		const objects_scrapped_optionned = module.exports.apply_options(objects_scrapped, options);
		return objects_scrapped_optionned;
	},
	scrap_link: (doc, search) => {
		const elements = [...doc.querySelectorAll('div div a')];
		const objects_scrapped = elements.map((element, index) => {
			const object_scrapped = {};
			object_scrapped.source = constants.NAME;
			object_scrapped.title = element.innerHTML ? element.innerHTML : constants_global.GLOBAL_NO_DATA;
			object_scrapped.link = element.getAttribute('href') ? element.getAttribute('href') : constants_global.GLOBAL_NO_DATA;
			object_scrapped.levenshtein = object_scrapped.title === constants_global.GLOBAL_NO_DATA ? constants_global.GLOBAL_MAX_LEVEINSTEIN : levenshtein(object_scrapped.title, search);
			return object_scrapped;
		});
		objects_scrapped.sort(utils.compare_by_levenshtein);
		return objects_scrapped;
	},
	apply_options: (objects_scrapped, options) => {
		let objects_scrapped_optionned = objects_scrapped;
		if (options.limit_per_website) {
			objects_scrapped_optionned = objects_scrapped_optionned.slice(0, options.limit_per_website);
		}

		return objects_scrapped_optionned;
	}
};
