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

function buildLabelsHTML(labels) {
    if (!Array.isArray(labels) || labels.length === 0) {
        return '';
    }

    return labels
        .map(function (label) {
            const labelKey = String(label).toLowerCase();
            const theme = LABEL_THEME[labelKey] || LABEL_THEME.default;

            return `<span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${theme.text} ${theme.bg} rounded-full">
                    <span>${theme.icon}</span>${String(label).toUpperCase()}
                </span>`;
        })
        .join('');
}

function buildPriorityBadge(priorityValue) {
    const priority = priorityValue || '';

    if (!priority) {
        return '';
    }

    const normalizedPriority = priority.toLowerCase();

    if (normalizedPriority === 'high') {
        return `<span class="px-2 py-1 text-xs font-semibold text-red-700 bg-red-50 rounded">${priority.toUpperCase()}</span>`;
    }

    if (normalizedPriority === 'medium') {
        return `<span class="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-50 rounded">${priority.toUpperCase()}</span>`;
    }

    return `<span class="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded">${priority.toUpperCase()}</span>`;
}

function createIssueCard(issue) {
    const statusTheme = STATUS_THEME[issue.status] || STATUS_THEME.default;
    const priorityBadge = buildPriorityBadge(issue.priority);
    const labelsHTML = buildLabelsHTML(issue.labels);

    const author = issue.author || 'Unknown';
    const date = new Date(issue.createdAt).toLocaleDateString();

    const card = document.createElement('div');
    card.className = `bg-white rounded-lg border border-gray-200 border-t-4 ${statusTheme.borderClass} p-4 shadow-sm`;
    card.innerHTML = `
        <div onclick="openIssueDetail(${issue.id})" class="cursor-pointer">
            <div class="flex items-start justify-between mb-3">
                <img src="${statusTheme.iconSrc}" alt="Status Icon" class="w-6 h-6" />
                ${priorityBadge}
            </div>
            <h3 class="text-sm font-bold text-gray-900 mb-2">${issue.title}</h3>
            <p class="text-xs text-gray-600 mb-3 leading-relaxed">${issue.description || 'No description available.'}</p>
            <div class="flex flex-wrap gap-2 mb-3">${labelsHTML}</div>
            <div class="text-xs text-gray-500 pt-2 border-t border-gray-100">
                <p class="mb-0.5">#${issue.id} by ${author}</p>
                <p>${date}</p>
            </div>
        </div>`;

    return card;
}

function renderIssueCards(issueList, targetGrid) {
    issueList.forEach(function (issue) {
        targetGrid.appendChild(createIssueCard(issue));
    });
}

function removeSpinners() {
    Object.values(DOM.spinners).forEach(function (spinner) {
        if (spinner) {
            spinner.remove();
        }
    });
}

function setIssueTotals(allCount, openCount, closedCount) {
    DOM.totals.all.textContent = allCount + ' Issues';
    DOM.totals.open.textContent = openCount + ' Issues';
    DOM.totals.closed.textContent = closedCount + ' Issues';
}

function splitIssuesByStatus(issues) {
    const openIssues = [];
    const closedIssues = [];

    issues.forEach(function (issue) {
        if (issue.status === 'open') {
            openIssues.push(issue);
        } else if (issue.status === 'closed') {
            closedIssues.push(issue);
        }
    });

    return {
        openIssues: openIssues,
        closedIssues: closedIssues,
    };
}

function hideMainSections() {
    DOM.sections.all.style.display = 'none';
    DOM.sections.open.style.display = 'none';
    DOM.sections.closed.style.display = 'none';
}

function resetTabButtons() {
    [DOM.tabs.all, DOM.tabs.open, DOM.tabs.closed].forEach(function (button) {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline');
        button.setAttribute('aria-selected', 'false');
    });
}

function switchTab(activeTabId) {
    resetTabButtons();
    hideMainSections();

    const activeTab = TAB_CONFIG[activeTabId];

    if (!activeTab) {
        return;
    }

    activeTab.button.classList.remove('btn-outline');
    activeTab.button.classList.add('btn-primary');
    activeTab.button.setAttribute('aria-selected', 'true');
    activeTab.section.style.display = 'block';
}

function showSearchMode() {
    DOM.tabs.container.style.display = 'none';
    hideMainSections();
    DOM.sections.search.style.display = 'block';
}

function hideSearchMode() {
    DOM.sections.search.style.display = 'none';
    DOM.tabs.container.style.display = 'flex';
    switchTab('tabAll');
}

function renderEmptySearch(query) {
    DOM.searchCount.textContent = 'No results for "' + query + '"';
    DOM.grids.search.innerHTML = '<p class="col-span-full text-center text-gray-500 py-10">No issues found.</p>';
}

function renderSearchResults(results, query) {
    DOM.searchCount.textContent =
        results.length +
        ' result' +
        (results.length > 1 ? 's' : '') +
        ' for "' + query + '"';
    renderIssueCards(results, DOM.grids.search);
}