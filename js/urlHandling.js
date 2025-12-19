let pathname = window.location.pathname;
if (pathname !== '/' && pathname.endsWith('/')) {
    window.history.replaceState({}, '', pathname.slice(0, -1));
    pathname = pathname.slice(0, -1);
}
if (pathname.endsWith('/index.html')) {
    const cleanPath = pathname.replace(/\/index\.html$/, '') || '/';
    window.location.replace(cleanPath);
}