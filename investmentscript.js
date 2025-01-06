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
    localStorage.setItem('investments', JSON.stringify(investments));  
    renderInvestments();  
}  

function renderInvestments() {  
    const investmentList = document.getElementById('investmentList');  
    investmentList.innerHTML = '';  

    const investments = JSON.parse(localStorage.getItem('investments')) || [];  
    investments.forEach(investment => {  
        const listItem = document.createElement('li');  
        listItem.textContent = `${investment.type} - Amount: ${investment.amount.toFixed(2)}, Tax: ${investment.tax.toFixed(2)}, Service Charge: ${investment.serviceCharge.toFixed(2)}, Dividend: ${investment.dividend.toFixed(2)}, Date: ${investment.date}, Remarks: ${investment.remarks}`;  
        investmentList.appendChild(listItem);  
    });  
}
