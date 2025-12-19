const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

if (!isLocalhost) {
    const {pathname, search, hash} = window.location;
    let newPath = pathname;
    if (newPath.length > 1 && newPath.endsWith('/')) {
        newPath = newPath.slice(0, -1);
    }
    if (newPath.endsWith('/index.html')) {
        newPath = newPath.replace(/\/index\.html$/, '') || '/';
    }
    const newUrl = newPath + search + hash;
    if (newUrl !== pathname + search + hash) {
        window.location.replace(newUrl);
    }
}