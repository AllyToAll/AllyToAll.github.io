const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
if (!isLocalhost) {
    const {pathname, search, hash} = window.location;
    let cleanPath = pathname;
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
    }
    if (cleanPath.endsWith('/index.html')) {
        cleanPath = cleanPath.replace(/\/index\.html$/, '') || '/';
    }
    if (cleanPath !== pathname) {
        window.location.replace(cleanPath + search + hash);
    }
}
