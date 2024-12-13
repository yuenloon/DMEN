document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const subject = document.getElementById('subject').value;
    const chapter = document.getElementById('chapter').value;
    const remarks = document.getElementById('remarks').value;
    const fileLink = document.getElementById('fileLink').value;

    const fileList = document.getElementById('fileList');
    const listItem = document.createElement('li');
    listItem.textContent = `${date} - ${subject} - ${chapter} - ${remarks}`;
    listItem.dataset.link = fileLink;

    listItem.addEventListener('click', function() {
        const filePreview = document.getElementById('filePreview');
        filePreview.innerHTML = `<iframe src="${this.dataset.link}" width="100%" height="400px"></iframe>`;
    });

    fileList.appendChild(listItem);

    // Save to localStorage
    const files = JSON.parse(localStorage.getItem('files')) || [];
    files.push({ date, subject, chapter, remarks, fileLink });
    localStorage.setItem('files', JSON.stringify(files));

    document.getElementById('uploadForm').reset();
});

// Load from localStorage
window.addEventListener('load', function() {
    const files = JSON.parse(localStorage.getItem('files')) || [];
    const fileList = document.getElementById('fileList');

    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = `${file.date} - ${file.subject} - ${file.chapter} - ${file.remarks}`;
        listItem.dataset.link = file.fileLink;

        listItem.addEventListener('click', function() {
            const filePreview = document.getElementById('filePreview');
            filePreview.innerHTML = `<iframe src="${this.dataset.link}" width="100%" height="400px"></iframe>`;
        });

        fileList.appendChild(listItem);
    });
});
