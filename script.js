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
        filePreview.innerHTML = `
            <iframe 
                src="${this.dataset.link}#page=1&view=FitH" 
                width="100%" 
                height="100%" 
                style="max-width: 100%; max-height: 100%;"
                sandbox="allow-same-origin allow-scripts allow-downloads"
                referrerpolicy="no-referrer"
                loading="lazy"
                allowfullscreen="false"
                mozallowfullscreen="false"
                webkitallowfullscreen="false"
            ></iframe>
        `;
    });
    
    // Rest of the code remains the same as in the previous version
    // ... (previous context menu and other event listeners)
});

// Similar modification in the localStorage loading section
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
            filePreview.innerHTML = `
                <iframe 
                    src="${this.dataset.link}#page=1&view=FitH" 
                    width="100%" 
                    height="100%" 
                    style="max-width: 100%; max-height: 100%;"
                    sandbox="allow-same-origin allow-scripts allow-downloads"
                    referrerpolicy="no-referrer"
                    loading="lazy"
                    allowfullscreen="false"
                    mozallowfullscreen="false"
                    webkitallowfullscreen="false"
                ></iframe>
            `;
        });
        
        // Rest of the code remains the same
        // ... (previous context menu and other event listeners)
    });
});

// Rest of the script remains unchanged
