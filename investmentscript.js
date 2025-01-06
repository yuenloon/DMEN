document.getElementById('investmentForm').addEventListener('submit', function (event) {  
    event.preventDefault(); // Prevent the form from submitting normally  

    // Get form values  
    const investmentType = document.getElementById('investmentType').value;  
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);  
    const tax = parseFloat(document.getElementById('tax').value);  
    const serviceCharge = parseFloat(document.getElementById('serviceCharge').value);  
    const dividend = parseFloat(document.getElementById('dividend').value);  
    const investmentDate = document.getElementById('investmentDate').value;  
    const investmentRemarks = document.getElementById('investmentRemarks').value;  

    // Create list item  
    const investmentList = document.getElementById('investmentList');  
    const listItem = document.createElement('li');  
    listItem.textContent = `${investmentType} - Amount: ${investmentAmount.toFixed(2)}, Tax: ${tax.toFixed(2)}, Service Charge: ${serviceCharge.toFixed(2)}, Dividend: ${dividend.toFixed(2)}, Date: ${investmentDate}, Remarks: ${investmentRemarks}`;  

    // Append to list  
    investmentList.appendChild(listItem);  

    // Reset form  
    document.getElementById('investmentForm').reset();  
});
