document.addEventListener('DOMContentLoaded', function () {
    function updateStudyCount() {
        document.getElementById('count').textContent = `This page contains ${document.querySelectorAll('h1').length} studies`;
    }

    updateStudyCount();
});