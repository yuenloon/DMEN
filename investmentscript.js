document.getElementById('addInvestment').addEventListener('click', function (event) {  
    event.preventDefault(); // Prevent the form from submitting normally  

    // Get form values (optional fields)  
    const investmentType = document.getElementById('investmentType').value || 'Unknown';  
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value) || 0;  
    const tax = parseFloat(document.getElementById('tax').value) || 0;  
    const serviceCharge = parseFloat(document.getElementById('serviceCharge').value) || 0;  
    const dividend = parseFloat(document.getElementById('dividend').value) || 0;  
    const investmentDate = document.getElementById('investmentDate').value || 'Unknown';  
    const investmentRemarks = document.getElementById('investmentRemarks').value || 'No remarks';  

    // Create list item  
    const investmentList = document.getElementById('investmentList');  
    const listItem = document.createElement('li');  
    listItem.textContent = `${investmentType} - Amount: ${investmentAmount.toFixed(2)}, Tax: ${tax.toFixed(2)}, Service Charge: ${serviceCharge.toFixed(2)}, Dividend: ${dividend.toFixed(2)}, Date: ${investmentDate}, Remarks: ${investmentRemarks}`;  

    // Append to list  
    investmentList.appendChild(listItem);  

    // Reset form  
    document.getElementById('investmentForm').reset();  
});
