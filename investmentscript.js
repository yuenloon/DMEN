document.getElementById('investmentForm').addEventListener('submit', function(event) {  
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

    // Send the investment data to Formspree  
    fetch(this.action, {  
        method: this.method,  
        body: new URLSearchParams(investment).toString(),  
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded'  
        }  
    }).then(response => {  
        console.log('Investment added successfully!');  
        // Reset the form  
        document.getElementById('investmentForm').reset();  
    }).catch(error => {  
        console.error('Error adding investment:', error);  
    });  
});
