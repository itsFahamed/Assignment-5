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