import select from 'select-dom';
import elementReady from 'element-ready';
import features from '../libs/features';
import * as pageDetect from '../libs/page-detect';
import SearchQuery from '../libs/search-query';

function init(): void {
	// Get issues links that don't already have a specific sorting applied
	// ignore PRs: [href*="/pulls"]:not([href*="sort%3A"]):not(.issues-reset-query),
	for (const link of select.all<HTMLAnchorElement>(`
		[href*="/issues"]:not([href*="sort%3A"]):not(.issues-reset-query)
	`)) {
		// Pick only links to lists, not single issues
		// + skip pagination links
		// + skip pr/issue filter dropdowns (some are lazyloaded)
                // + skip PRs altogether (/(issues|pulls)\/?$/.test(link.pathname) 
		if (/issues\/?$/.test(link.pathname) && !link.closest('.pagination, .table-list-filters')) {
			new SearchQuery(link).set('sort:updated-desc');
		}
	}
}

async function cleanBar(): Promise<void> {
	(await elementReady<HTMLInputElement>('.header-search-input'))!.value = '';
}

features.add({
	id: __filebasename,
	description: 'Shows both open and closed issues and sorts them by `Recently updated`. Does not apply to PRs.',
	screenshot: false
}, {
	init
}, {
	include: [
		pageDetect.isGlobalDiscussionList
	],
	waitForDomReady: false,
	repeatOnAjax: false,
	init: cleanBar
});
