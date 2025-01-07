// Initialize Supabase client
const supabaseUrl = 'https://fhawjjmjijeqfqoycbkw.supabase.co';  
const supabaseKey = 'your-supabase-key';  // Be careful not to expose sensitive keys in production
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized:', supabase);

document.getElementById('investmentForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const investmentType = document.getElementById('investmentType').value;
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
    const tax = parseFloat(document.getElementById('tax').value);
    const serviceCharge = parseFloat(document.getElementById('serviceCharge').value);
    const dividend = parseFloat(document.getElementById('dividend').value);
    const investmentDate = document.getElementById('investmentDate').value;

    // Check if the necessary fields have valid values
    if (isNaN(investmentAmount) || isNaN(tax) || isNaN(serviceCharge) || isNaN(dividend)) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Create investment object
    const investment = {
        type: investmentType,
        amount: investmentAmount,
        tax: tax,
        serviceCharge: serviceCharge,
        dividend: dividend,
        date: investmentDate
    };

    try {
        // Send the investment data to Formspree
        await fetch(this.action, {
            method: this.method,
            body: new URLSearchParams(investment).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Insert the investment data into Supabase
        const { data, error } = await supabase.from('investments').insert([investment]);

        if (error) {
            console.error('Error adding investment:', error);
        } else {
            console.log('Investment added successfully!');
            // Reset the form
            document.getElementById('investmentForm').reset();
        }
    } catch (error) {
        console.error('Error adding investment:', error);
    }
});
