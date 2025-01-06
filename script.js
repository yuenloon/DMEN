// Create Supabase client using the global supabaseJs object
const supabaseUrl = 'https://fhawjjmjijeqfqoycbkw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYXdqam1qaWplcWZxb3ljYmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNDI2NjksImV4cCI6MjA1MTcxODY2OX0.jPqFRNkRgNM7jYHByfq4ihNfdr6vKlYDjr-77T-p-20';
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

// Add event listener for the form submission
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Log the form submission attempt
    console.log('Form submission started');

    try {
        // Get and validate form values
        const subjectElement = document.querySelector('input[name="subject"]:checked');
        if (!subjectElement) {
            throw new Error('No subject selected');
        }
        const subject = subjectElement.value;
        
        const chapter = document.getElementById('chapter').value;
        if (!chapter) {
            throw new Error('Chapter is required');
        }
        
        const remarks = document.getElementById('remarks').value;
        const fileLink = document.getElementById('fileLink').value;
        if (!fileLink) {
            throw new Error('File link is required');
        }

        // Log the data being sent
        console.log('Attempting to insert data:', {
            subject,
            chapter,
            remarks,
            file_link: fileLink
        });

        // Insert the form data into Supabase
        const { data, error } = await supabase
            .from('files')
            .insert([
                {
                    subject,
                    chapter,
                    remarks,
                    file_link: fileLink
                }
            ])
            .select(); // Add .select() to return the inserted data

        if (error) {
            throw error;
        }

        console.log('Data inserted successfully:', data);

        // Add the new entry to the file list
        const fileList = document.getElementById('fileList');
        const listItem = document.createElement('li');
        listItem.textContent = `${subject} - ${chapter} - ${remarks}`;
        listItem.dataset.link = fileLink;
        listItem.dataset.id = data[0].id; // Store the ID for deletion

        // Add click event to show preview
        listItem.addEventListener('click', function() {
            const filePreview = document.getElementById('filePreview');
            filePreview.innerHTML = `
                <iframe
                    src="${this.dataset.link}#page=1&view=FitH"
                    width="100%"
                    height="100%"
                    style="max-width: 100%; max-height: 100%;"
                ></iframe>
            `;
        });

        // Add context menu event ONLY for the list item
        listItem.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showContextMenu(event, listItem);
        });

        fileList.appendChild(listItem);
        
        // Reset form
        document.getElementById('uploadForm').reset();
        
        // Show success message
        alert('File information saved successfully!');

    } catch (err) {
        console.error('Error details:', {
            message: err.message,
            code: err?.code,
            details: err?.details
        });
        alert(`Error saving data: ${err.message}`);
    }
});

// Load files from Supabase on page load
window.addEventListener('load', async function() {
    await verifyTableStructure(); // Check table structure on load
    
    const { data: files, error } = await supabase
        .from('files')
        .select('*');

    if (error) {
        console.error('Error fetching files:', error);
        alert('Error loading files. Please try again.');
    } else {
        const fileList = document.getElementById('fileList');

        files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = `${file.subject} - ${file.chapter} - ${file.remarks}`;
            listItem.dataset.link = file.file_link;
            listItem.dataset.id = file.id;

            // Add click event to show preview
            listItem.addEventListener('click', function() {
                const filePreview = document.getElementById('filePreview');
                filePreview.innerHTML = `
                    <iframe
                        src="${this.dataset.link}#page=1&view=FitH"
                        width="100%"
                        height="100%"
                        style="max-width: 100%; max-height: 100%;"
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
    }

    // Prevent context menu on the entire document
    document.addEventListener('contextmenu', function(event) {
        if (!event.target.closest('#fileList li')) {
            event.preventDefault();
        }
    });
});

// Verify table structure function
async function verifyTableStructure() {
    try {
        const { data, error } = await supabase
            .from('files')
            .select()
            .limit(1);
            
        if (error) throw error;
        
        console.log('Table structure:', {
            exists: true,
            sampleData: data,
            columns: data.length > 0 ? Object.keys(data[0]) : 'No data available'
        });
    } catch (err) {
        console.error('Error verifying table structure:', err);
    }
}

// Context menu functionality
function showContextMenu(event, listItem) {
    const contextMenu = document.getElementById('contextMenu');

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

    let left = event.pageX;
    let top = event.pageY;

    if (left + contextMenu.offsetWidth > window.innerWidth) {
        left = window.innerWidth - contextMenu.offsetWidth;
    }

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
    document.getElementById('removeLink').onclick = async function() {
        try {
            const { error } = await supabase
                .from('files')
                .delete()
                .eq('id', listItem.dataset.id);

            if (error) throw error;

            listItem.remove();
            console.log('Item successfully deleted');
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Error deleting item. Please try again.');
        }

        contextMenu.style.display = 'none';
        backdrop.remove();
    };

    // Hide context menu and backdrop when clicking elsewhere
    backdrop.addEventListener('click', function() {
        contextMenu.style.display = 'none';
        backdrop.remove();
    });
}
