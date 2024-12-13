document.getElementById('fileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileLink = document.getElementById('fileLink').value;
    const fileRemark = document.getElementById('fileRemark').value;

    const fileList = document.getElementById('fileList');
    const listItem = document.createElement('li');
    listItem.textContent = fileRemark;
    listItem.dataset.link = fileLink;

    listItem.addEventListener('click', function() {
        const filePreview = document.getElementById('filePreview');
        filePreview.innerHTML = `<iframe src="${this.dataset.link}" width="100%" height="400px"></iframe>`;
    });

    fileList.appendChild(listItem);

    document.getElementById('fileLink').value = '';
    document.getElementById('fileRemark').value = '';
});
