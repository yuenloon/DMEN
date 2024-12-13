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

    listItem.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        showContextMenu(event, listItem);
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

        listItem.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showContextMenu(event, listItem);
        });

        fileList.appendChild(listItem);
    });
});

function showContextMenu(event, listItem) {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;

    document.getElementById('openLink').onclick = function() {
        window.open(listItem.dataset.link, '_blank');
        contextMenu.style.display = 'none';
    };

    document.getElementById('removeLink').onclick = function() {
        listItem.parentNode.removeChild(listItem);
        removeFromLocalStorage(listItem.textContent);
        contextMenu.style.display = 'none';
    };

    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    }, { once: true });
}

function removeFromLocalStorage(itemText) {
    const files = JSON.parse(localStorage.getItem('files')) || [];
    const updatedFiles = files.filter(file => 
        `${file.date} -[_{{{CITATION{{{_1{](https://github.com/antydemant/lessons-2020/tree/0c6095f45bfd841914ac8e7e25f8c9df273dea69/02-closure-and-context%2Fhomework%2FREADME.md)
