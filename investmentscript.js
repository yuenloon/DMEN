document.getElementById('investmentForm').addEventListener('submit', function(event) {  
    event.preventDefault(); // Prevent the form from submitting normally  

    // Get form values  
    const investmentType = document.getElementById('investmentType').value;  
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);  
    const tax = parseFloat(document.getElementById('tax').value);  
    const serviceCharge = parseFloat(document.getElementById('serviceCharge').value);  
    const dividend = parseFloat(document.getElementById('dividend').value);  
    const investmentDate = document.getElementById('investmentDate').value;  
    const investmentRemarks = document.getElementById('investmentRemarks').value;  

    // Create investment object  
    const investment = {  
        type: investmentType,  
        amount: investmentAmount,  
        tax: tax,  
        serviceCharge: serviceCharge,  
        dividend: dividend,  
        date: investmentDate,  
        remarks: investmentRemarks  
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
        // Add the investment to the table  
        addInvestmentToTable(investment);  
        // Reset the form  
        document.getElementById('investmentForm').reset();  
    }).catch(error => {  
        console.error('Error adding investment:', error);  
    });  
});  

function addInvestmentToTable(investment) {  
    const investmentTable = document.getElementById('investmentTable').getElementsByTagName('tbody')[0];  
    const row = document.createElement('tr');  
    row.innerHTML = `  
        <td>${investment.type}</td>  
        <td>${investment.amount.toFixed(2)}</td>  
        <td>${investment.tax.toFixed(2)}</td>  
        <td>${investment.serviceCharge.toFixed(2)}</td>  
        <td>${investment.dividend.toFixed(2)}</td>  
        <td>${investment.date}</td>  
        <td>${investment.remarks}</td>  
    `;  
    investmentTable.appendChild(row);  
}
