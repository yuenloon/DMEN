// Wait until the Supabase SDK script has loaded
const supabaseScript = document.getElementById('supabase-script');

supabaseScript.onload = function () {
    // Now the Supabase SDK is loaded, initialize the Supabase client
    if (typeof window.supabase !== 'undefined') {
        const supabaseUrl = 'https://fhawjjmjijeqfqoycbkw.supabase.co';
        const supabaseKey = 'your-supabase-key';  // Be careful with exposing your API keys
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        console.log('Supabase client initialized:', supabase);

        document.getElementById('investmentForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the form from submitting normally

            // Get form values
            const investmentType = document.getElementById('investmentType').value;
            const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
            const tax = parseFloat(document.getElementById('tax').value);
            const serviceCharge = parseFloat(document.getElementById('serviceCharge').value);
            const dividend = parseFloat(document.getElementById('dividend').value);
            const investmentDate = document.getElementById('investmentDate').value;

            // Validate the values
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
    } else {
        console.error('Supabase client not found. Ensure the Supabase script is loaded.');
    }
};
