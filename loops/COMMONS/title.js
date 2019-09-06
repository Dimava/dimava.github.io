(() => {
    document.title = process.cwd().split('\\').pop().replace(/\b./, s => s.toUpperCase());
})();