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
        // Save the investment data to local storage  
        saveInvestmentToLocalStorage(investment);  
        // Reset the form  
        document.getElementById('investmentForm').reset();  
    }).catch(error => {  
        console.error('Error adding investment:', error);  
    });  
});  

function saveInvestmentToLocalStorage(investment) {  
    let investments = JSON.parse(localStorage.getItem('investments')) || [];  
    investments.push(investment);  
    investments.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort investments by date  
    localStorage.setItem('investments', JSON.stringify(investments));  
    renderInvestments();  
}  

function renderInvestments() {  
    const investmentTable = document.getElementById('investmentTable').getElementsByTagName('tbody')[0];  
    investmentTable.innerHTML = '';  

    const investments = JSON.parse(localStorage.getItem('investments')) || [];  
    investments.forEach(investment => {  
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
    });  
}
