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
    
    // Hide the message after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Initialize Supabase client
let supabase = null;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase initialized successfully');
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
    showStatus('Failed to initialize database connection', true);
}

// Form submission handler
document.getElementById('investmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
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

    // Validate numbers
    const numberFields = ['amount', 'tax', 'service_charge', 'dividend'];
    for (const field of numberFields) {
        if (isNaN(investment[field])) {
            showStatus(`Invalid value for ${field}`, true);
            return;
        }
    }

    try {
        // Show loading status
        showStatus('Adding investment...');
        
        // Send to Formspree
        try {
            const formspreeResponse = await fetch(this.action, {
                method: this.method,
                body: new URLSearchParams(investment).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            if (!formspreeResponse.ok) {
                throw new Error('Formspree submission failed');
            }
        } catch (error) {
            console.error('Formspree error:', error);
            // Continue with Supabase even if Formspree fails
        }

        // Send to Supabase
        const { data, error } = await supabase
            .from('investments')
            .insert([investment]);

        if (error) {
            throw error;
        }

        // Success
        showStatus('Investment added successfully!');
        this.reset();
        
        // Log success details
        console.log('Investment added:', {
            formData: investment,
            supabaseResponse: data
        });

    } catch (error) {
        console.error('Error details:', error);
        showStatus(`Error: ${error.message || 'Failed to add investment'}`, true);
    }
});

// Add this to verify Supabase is working
window.addEventListener('load', async () => {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('investments')
                .select('count')
                .limit(1);
                
            if (error) {
                throw error;
            }
            console.log('Supabase connection test successful');
        } catch (error) {
            console.error('Supabase connection test failed:', error);
            showStatus('Database connection test failed. Please check your configuration.', true);
        }
    }
});
