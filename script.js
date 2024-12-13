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
    
    // Add context menu event ONLY for the list item
    listItem.addEventListener('contextmenu', function(event) {
        // Prevent default context menu
        event.preventDefault();
        
        // Remove any existing context menus
        const existingContextMenu = document.getElementById('contextMenu');
        const existingBackdrop = document.querySelector('.context-menu-backdrop');
        if (existingContextMenu) existingContextMenu.style.display = 'none';
        if (existingBackdrop) existingBackdrop.remove();
        
        // Show context menu
        showContextMenu(event, listItem);
    });
    
    // Prevent context menu on the entire document
    document.addEventListener('contextmenu', function(event) {
        // Only prevent default if not on a list item
        if (!event.target.closest('#fileList li')) {
            event.preventDefault();
        }
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
        
        // Add context menu event ONLY for the list item
        listItem.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showContextMenu(event, listItem);
        });
        
        fileList.appendChild(listItem);
    });

    // Prevent context menu on the entire document
    document.addEventListener('contextmenu', function(event) {
        // Only prevent default if not on a list item
        if (!event.target.closest('#fileList li')) {
            event.preventDefault();
        }
    });
});

// Context menu functionality
function showContextMenu(event, listItem) {
    const contextMenu = document.getElementById('contextMenu');
    
    // Remove any existing backdrop
    const existingBackdrop = document.querySelector('.context-menu-backdrop');
    if (existingBackdrop) {
        existingBackdrop.remove();
    }
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.classList.add('context-menu-backdrop');
    document.body.appendChild(backdrop);
    
    // Position and show context menu
    contextMenu.style.display = 'block';
    
    // Calculate menu position to keep it within viewport
    let left = event.pageX;
    let top = event.pageY;
    
    // Adjust if menu would go outside right of screen
    if (left + contextMenu.offsetWidth > window.innerWidth) {
        left = window.innerWidth - contextMenu.offsetWidth;
    }
    
    // Adjust if menu would go outside bottom of screen
    if (top + contextMenu.offsetHeight > window.innerHeight) {
        top = window.innerHeight - contextMenu.offsetHeight;
    }
    
    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
    
    // Open link
    document.getElementById('openLink').onclick = function() {
        window.open(listItem.dataset.link, '_blank');
        contextMenu.style.display = 'none';
        backdrop.remove();
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
        backdrop.remove();
    };
    
    // Hide context menu and backdrop when clicking elsewhere
    backdrop.addEventListener('click', function() {
        contextMenu.style.display = 'none';
        backdrop.remove();
    });
}
