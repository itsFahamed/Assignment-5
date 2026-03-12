const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';
const SEARCH_DEBOUNCE_MS = 300;

const DOM = {
	tabs: {
		container: document.getElementById('tabContainer'),
		all: document.getElementById('tabAll'),
		open: document.getElementById('tabOpen'),
		closed: document.getElementById('tabClosed'),
	},
	sections: {
		all: document.getElementById('allIssuesSection'),
		open: document.getElementById('openIssuesSection'),
		closed: document.getElementById('closedIssuesSection'),
		search: document.getElementById('searchResultsSection'),
	},
	grids: {
		all: document.getElementById('allIssuesGrid'),
		open: document.getElementById('openIssuesGrid'),
		closed: document.getElementById('closedIssuesGrid'),
		search: document.getElementById('searchResultsGrid'),
	},
	spinners: {
		all: document.getElementById('allSpinner'),
		open: document.getElementById('openSpinner'),
		closed: document.getElementById('closedSpinner'),
	},
	totals: {
		all: document.getElementById('allIssueTotal'),
		open: document.getElementById('openIssueTotal'),
		closed: document.getElementById('closedIssueTotal'),
	},
	searchCount: document.getElementById('searchResultsCount'),
	searchInput: document.getElementById('issueSearchBox'),
	detailModal: document.getElementById('issueDetailModal'),
};

const LABEL_THEME = {
	bug: { icon: '🪲', bg: 'bg-red-50', text: 'text-red-600' },
	'help wanted': { icon: '⭕', bg: 'bg-green-50', text: 'text-green-600' },
	enhancement: { icon: '✨', bg: 'bg-purple-50', text: 'text-purple-600' },
	'good first issue': { icon: '🖊️', bg: 'bg-orange-50', text: 'text-orange-600' },
	default: { icon: '🏷️', bg: 'bg-blue-50', text: 'text-blue-700' },
};

const STATUS_THEME = {
	open: {
		borderClass: 'border-t-green-500',
		iconSrc: 'assets/Open-Status.png',
	},
	closed: {
		borderClass: 'border-t-purple-500',
		iconSrc: 'assets/Closed- Status .png',
	},
	default: {
		borderClass: 'border-t-gray-400',
		iconSrc: 'assets/Aperture.png',
	},
};

const DETAIL_STATUS_CLASSES = {
    open: 'px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full',
    closed: 'px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full',
};

const DETAIL_PRIORITY_CLASSES = {
    high: 'inline-block px-4 py-1 text-xs font-bold text-white bg-red-500 rounded-full uppercase',
    medium: 'inline-block px-4 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full uppercase',
    default: 'inline-block px-4 py-1 text-xs font-bold text-white bg-gray-500 rounded-full uppercase',
};

const TAB_CONFIG = {
    tabAll: { button: DOM.tabs.all, section: DOM.sections.all },
    tabOpen: { button: DOM.tabs.open, section: DOM.sections.open },
    tabClosed: { button: DOM.tabs.closed, section: DOM.sections.closed },
};

function fetchJson(url) {
    return fetch(url).then(function (response) {
        return response.json();
    });
}