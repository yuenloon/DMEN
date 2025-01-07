// Configuration
const SUPABASE_URL = 'https://fhawjjmjijeqfqoycbkw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYXdqam1qaWplcWZxb3ljYmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNDI2NjksImV4cCI6MjA1MTcxODY2OX0.jPqFRNkRgNM7jYHByfq4ihNfdr6vKlYDjr-77T-p-20';

// Helper function to show status messages
function showStatus(message, isError = false) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.style.display = 'block';
    statusDiv.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
    statusDiv.style.color = isError ? '#c62828' : '#2e7d32';
    statusDiv.textContent = message;
    console.log(`Status Message: ${message}`); // Debug log
}

// Initialize Supabase client
let supabase = null;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client created:', supabase); // Debug log
    
    // Test the connection immediately
    supabase
        .from('investments')
        .select('count')
        .limit(1)
        .then(({ data, error }) => {
            if (error) {
                console.error('Supabase connection test error:', error); // Debug log
                showStatus('Database connection test failed: ' + error.message, true);
            } else {
                console.log('Supabase connection test successful. Data:', data); // Debug log
            }
        });
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
    showStatus('Failed to initialize database connection: ' + error.message, true);
}

// Form submission handler
document.getElementById('investmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Form submission started'); // Debug log
    
    if (!supabase) {
        showStatus('Database connection not initialized', true);
        return;
    }

    // Get form values
    const investment = {
        type: document.getElementById('investmentType').value,
        amount: parseFloat(document.getElementById('investmentAmount').value),
        tax: parseFloat(document.getElementById('tax').value),
        service_charge: parseFloat(document.getElementById('serviceCharge').value),
        dividend: parseFloat(document.getElementById('dividend').value),
        date: document.getElementById('investmentDate').value,
        created_at: new Date().toISOString()
    };

    console.log('Investment data to be sent:', investment); // Debug log

    try {
        showStatus('Adding investment...');
        
        // Log the actual request to Supabase
        console.log('Sending request to Supabase...'); // Debug log
        
        const { data, error } = await supabase
            .from('investments')
            .insert([investment])
            .select(); // Add .select() to get back the inserted data

        console.log('Supabase response received:', { data, error }); // Debug log

        if (error) {
            console.error('Supabase error details:', error); // Debug log
            throw error;
        }

        console.log('Investment added successfully:', data); // Debug log
        showStatus('Investment added successfully!');
        this.reset();

    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        }); // Debug log
        showStatus(`Error: ${error.message || 'Failed to add investment'}`, true);
    }
});

// Test table access on page load
window.addEventListener('load', async () => {
    console.log('Page loaded, testing table access...'); // Debug log
    if (supabase) {
        try {
            // Try to insert a test record
            const testData = {
                type: 'TEST',
                amount: 0,
                tax: 0,
                service_charge: 0,
                dividend: 0,
                date: new Date().toISOString().split('T')[0],
                created_at: new Date().toISOString()
            };
            
            console.log('Attempting test insert with data:', testData); // Debug log
            
            const { data, error } = await supabase
                .from('investments')
                .insert([testData])
                .select();

            if (error) {
                console.error('Test insert failed:', error); // Debug log
                showStatus('Database test failed. Error: ' + error.message, true);
            } else {
                console.log('Test insert successful:', data); // Debug log
                // Clean up test data
                await supabase
                    .from('investments')
                    .delete()
                    .match({ type: 'TEST' });
            }
        } catch (error) {
            console.error('Database test failed:', error);
            showStatus('Database test failed: ' + error.message, true);
        }
    }
});
