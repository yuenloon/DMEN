// Initialize Supabase client  
const supabaseUrl = 'https://fhawjjmjijeqfqoycbkw.supabase.co';  
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYXdqam1qaWplcWZxb3ljYmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNDI2NjksImV4cCI6MjA1MTcxODY2OX0.jPqFRNkRgNM7jYHByfq4ihNfdr6vKlYDjr-77T-p-20';  
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);  

document.getElementById('investmentForm').addEventListener('submit', async function(event) {  
    event.preventDefault(); // Prevent the form from submitting normally  

    // Get form values  
    const investmentType = document.getElementById('investmentType').value;  
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);  
    const tax = parseFloat(document.getElementById('tax').value);  
    const serviceCharge = parseFloat(document.getElementById('serviceCharge').value);  
    const dividend = parseFloat(document.getElementById('dividend').value);  
    const investmentDate = document.getElementById('investmentDate').value;  

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
