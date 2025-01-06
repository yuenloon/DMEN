// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Supabase URL and API Key
const supabaseUrl = 'https://fhawjjmjijeqfqoycbkw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYXdqam1qaWplcWZxb3ljYmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNDI2NjksImV4cCI6MjA1MTcxODY2OX0.jPqFRNkRgNM7jYHByfq4ihNfdr6vKlYDjr-77T-p-20';
const supabase = createClient(supabaseUrl, supabaseKey);

// Add event listener for the form submission
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const subject = document.querySelector('input[name="subject"]:checked').value;
    const chapter = document.getElementById('chapter').value;
    const remarks = document.getElementById('remarks').value;
    const fileLink = document.getElementById('fileLink').value;

    // Insert the form data into Supabase
    const { data, error } = await supabase
        .from('files') // Specify the name of your table in Supabase
        .insert([
            {
                subject: subject,
                chapter: chapter,
                remarks: remarks,
                file_link: fileLink
            }
        ]);

    if (error) {
        console.error('Error inserting data:', error);
        alert('Error saving data. Please try again.');
    } else {
        console.log('Data inserted successfully:', data);

        // Add the new entry to the file list
        const fileList = document.getElementById('fileList');
        const listItem = document.createElement('li');
        listItem.textContent = `${subject} - ${chapter} - ${remarks}`;
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
                ></iframe>
            `;
        });

        // Add context menu event ONLY for the list item
        listItem.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showContextMenu(event, listItem);
        });

        // Append to list
        fileList.appendChild(listItem);
        
        // Reset form
        document.getElementById('uploadForm').reset();
    }
});

// Load files from Supabase on page load
window.addEventListener('load', async function() {
    const { data: files, error } = await supabase
        .from('files') // Fetch data from Supabase
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
    document.getElementById('removeLink').onclick = function() {
        listItem.remove();

        // Remove the item from Supabase
        supabase
            .from('files')
            .delete()
            .eq('id', listItem.dataset.id); // Assuming the id is saved as a data attribute

        contextMenu.style.display = 'none';
        backdrop.remove();
    };

    // Hide context menu and backdrop when clicking elsewhere
    backdrop.addEventListener('click', function() {
        contextMenu.style.display = 'none';
        backdrop.remove();
    });
}
