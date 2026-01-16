const content = document.getElementById('content');
const filtersEl = document.getElementById('filters');
let allStudies = [];
let activeTags = new Set();

async function loadAllStudies() {
    const res = await fetch('/studies/data/index.json');
    if (!res.ok) return console.error('Failed to load index.json');
    const files = await res.json();
    const requests = files.map(file => fetch(`/studies/data/${file}`).then(r => r.ok ? r.json() : Promise.reject(`Failed to load ${file}`)));
    allStudies = await Promise.all(requests);
}

function makeSafeId(doi) {
    return doi.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function renderStudies(studies) {
    content.innerHTML = '';
    studies.forEach(study => {
        const article = document.createElement('article');
        const h1 = document.createElement('h1');
        h1.id = makeSafeId(study.doi);
        h1.textContent = study.title;
        const p = document.createElement('p');
        if (study.summary) {
            const summary = document.createElement('strong');
            summary.textContent = study.summary;
            p.append(summary, ' ');
        }
        const link = document.createElement('a');
        link.href = study.doi.startsWith('http') ? study.doi : `https://doi.org/${study.doi}`;
        link.textContent = link.href;
        link.target = '_blank';
        link.rel = 'noopener';
        p.append(link);
        article.append(h1, p);
        if (study.tags?.length) {
            const tagsEl = document.createElement('p');
            tagsEl.style.display = 'inline-flex';
            tagsEl.style.flexWrap = 'wrap';
            tagsEl.style.gap = '0.3em';
            study.tags.forEach(tag => {
                const img = document.createElement('img');
                const encodedTag = encodeURIComponent(tag.replace(/\s+/g, '_').replace(/-/g, '--'));
                const colour = 'ffffff'; // neutral grey
                img.src = `https://img.shields.io/badge/${encodedTag}-${colour}`;
                img.alt = tag;
                img.setAttribute('data-tag', tag);
                img.style.height = '1.5em';
                img.style.width = 'auto';
                img.style.verticalAlign = 'middle';
                tagsEl.append(img);
            });
            article.append(tagsEl);
        }
        content.append(article);
    });
    document.getElementById('study-count').textContent = `Studies displayed: ${studies.length}`;
}

function getAllTags(studies) {
    const tags = new Set();
    studies.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return [...tags].sort();
}

function renderFilters(tags) {
    filtersEl.innerHTML = '';
    const title = document.createElement('div');
    title.textContent = 'Filter by tag: ';
    filtersEl.append(title);
    const container = document.createElement('div');
    container.style.display = 'inline-flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '0.5em';
    tags.sort((a, b) => a.localeCompare(b));
    tags.forEach(tag => {
        const label = document.createElement('label');
        label.style.cursor = 'pointer';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = tag;
        checkbox.addEventListener('change', () => {
            checkbox.checked ? activeTags.add(tag) : activeTags.delete(tag);
            applyFilters();
        });
        label.append(checkbox, ' ', tag);
        container.append(label);
    });
    filtersEl.append(container);
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
