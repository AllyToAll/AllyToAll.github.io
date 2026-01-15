(() => {
    const {hostname, pathname, search, hash} = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return;
    if (pathname.endsWith('.json')) {
        return;
    }
    let cleanPath = pathname;
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
    }
    if (cleanPath.endsWith('/index.html')) {
        cleanPath = cleanPath.replace(/\/index\.html$/, '') || '/';
    }
    if (cleanPath !== pathname) {
        history.replaceState(null, '', cleanPath + search + hash);
    }
})();
