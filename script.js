document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values
    const date = document.getElementById('date').value;
    const subject = document.getElementById('subject').value;
    const chapter = document.getElementById('chapter').value;
    const remarks = document.getElementById('remarks').value;
    const fileLink = document.getElementById('fileLink').value;
    
    // Create list item
    const fileList = document.getElementById('fileList');
    const listItem = document.createElement('li');
    listItem.textContent = `${date} - ${subject} - ${chapter} - ${remarks}`;
    listItem.dataset.link = fileLink;
    
    // Add click event to show preview
    listItem.addEventListener('click', function() {
        const filePreview = document.getElementById('filePreview');
        filePreview.innerHTML = `<iframe src="${this.dataset.link}" width="100%" height="500px"></iframe>`;
    });
    
    // Add context menu event
    listItem.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        showContextMenu(event, listItem);
    });
    
    // Append to list
    fileList.appendChild(listItem);
    
    // Save to localStorage
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    files.push({ 
        date, 
        subject, 
        chapter, 
        remarks, 
        fileLink 
    });
    localStorage.setItem('files', JSON.stringify(files));
    
    // Reset form
    document.getElementById('uploadForm').reset();
});

// Load files from localStorage on page load
window.addEventListener('load', function() {
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const fileList = document.getElementById('fileList');
    
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = `${file.date} - ${file.subject} - ${file.chapter} - ${file.remarks}`;
        listItem.dataset.link = file.fileLink;
        
        // Add click event to show preview
        listItem.addEventListener('click', function() {
            const filePreview = document.getElementById('filePreview');
            filePreview.innerHTML = `<iframe src="${this.dataset.link}" width="100%" height="500px"></iframe>`;
        });
        
        // Add context menu event
        listItem.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showContextMenu(event, listItem);
        });
        
        fileList.appendChild(listItem);
    });
});

// Context menu functionality
function showContextMenu(event, listItem) {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    
    // Open link
    document.getElementById('openLink').onclick = function() {
        window.open(listItem.dataset.link, '_blank');
        contextMenu.style.display = 'none';
    };
    
    // Remove item
    document.getElementById('removeLink').onclick = function() {
        // Remove from list
        listItem.remove();
        
        // Remove from localStorage
        const files = JSON.parse(localStorage.getItem('files') || '[]');
        const updatedFiles = files.filter(file => 
            `${file.date} - ${file.subject} - ${file.chapter} - ${file.remarks}` !== listItem.textContent
        );
        localStorage.setItem('files', JSON.stringify(updatedFiles));
        
        contextMenu.style.display = 'none';
    };
    
    // Hide context menu when clicking elsewhere
    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    }, { once: true });
}
