const content = document.getElementById('content');
const filtersEl = document.getElementById('filters');

let allStudies = [];
let activeTags = new Set();

async function loadAllStudies() {
    const res = await fetch('/studies/data/index.json');
    if (!res.ok) {
        console.error('Failed to load index.json');
        return;
    }

    const files = await res.json();
    const requests = files.map(file => fetch(`/studies/data/${file}`).then(r => {
        if (!r.ok) {
            throw new Error(`Failed to load ${file}`);
        }
        return r.json();
    }));

    allStudies = await Promise.all(requests);
}


function makeSafeId(doi) {
    return doi.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function processDescriptionHTML(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    wrapper.querySelectorAll('a[href^="#"]').forEach(a => {
        const rawDoi = decodeURIComponent(a.getAttribute('href').slice(1));
        a.setAttribute('href', `#${makeSafeId(rawDoi)}`);
    });

    return wrapper;
}

function renderStudies(studies) {
    content.innerHTML = '';

    studies.forEach(study => {
        const article = document.createElement('article');

        const h1 = document.createElement('h1');
        const safeId = makeSafeId(study.doi);
        h1.id = safeId;
        h1.textContent = study.title;

        const p = document.createElement('p');

        if (study.summary) {
            const summary = document.createElement('strong');
            summary.textContent = study.summary;
            p.append(summary, document.createElement('br'));
        }

        const link = document.createElement('a');
        link.href = study.doi.startsWith('http') ? study.doi : `https://doi.org/${study.doi}`;
        link.textContent = link.href;
        link.target = '_blank';
        link.rel = 'noopener';

        p.append(link);

        if (study.description) {
            p.append(document.createElement('br'), document.createElement('br'));
            p.append(processDescriptionHTML(study.description));
        }

        article.append(h1, p);
        content.append(article);
    });
}

function getAllTags(studies) {
    const tags = new Set();
    studies.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return [...tags].sort();
}

function renderFilters(tags) {
    filtersEl.innerHTML = '<strong>Filter by tag:</strong><br>';

    tags.forEach(tag => {
        const label = document.createElement('label');
        label.style.marginRight = '1em';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = tag;

        checkbox.addEventListener('change', () => {
            checkbox.checked ? activeTags.add(tag) : activeTags.delete(tag);
            applyFilters();
        });

        label.append(checkbox, ' ', tag);
        filtersEl.append(label);
    });
}

function applyFilters() {
    if (activeTags.size === 0) {
        renderStudies(allStudies);
        return;
    }

    const filtered = allStudies.filter(study => study.tags?.some(tag => activeTags.has(tag)));

    renderStudies(filtered);
}

(async () => {
    await loadAllStudies();
    renderStudies(allStudies);
    renderFilters(getAllTags(allStudies));

    if (location.hash) {
        const id = decodeURIComponent(location.hash.slice(1));
        document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    }
})();
