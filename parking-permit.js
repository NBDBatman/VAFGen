document.addEventListener('DOMContentLoaded', function () {
    addPageTransitionHandler();

    // Hide the loading overlay once the page is fully loaded
    window.addEventListener('load', function () {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'none';
    });
});

function generatePermitNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let permitNumber = '';

    // Add 2 random capital letters
    for (let i = 0; i < 2; i++) {
        permitNumber += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    permitNumber += '-';

    // Add 8 random numbers
    for (let i = 0; i < 8; i++) {
        permitNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return permitNumber;
}

function generateDocument() {
    clearErrorMessages();

    const permitNumber = generatePermitNumber();
    const dateOfIssue = new Date();
    const formattedDateOfIssue = formatDate(dateOfIssue);
    const permitHolderName = document.getElementById('permitHolderName').value.trim();
    const location = document.getElementById('location').value.trim();
    const dateOfAuthorizationInput = document.getElementById('dateOfAuthorization').value.trim();
    const dateOfAuthorization = formatDate(new Date(dateOfAuthorizationInput));
    const authorizingPersonName = document.getElementById('authorizingPersonName').value.trim();

    let isValid = true;

    if (!permitHolderName) {
        showError('permitHolderName', 'Permit Holder Name is required.');
        isValid = false;
    }
    if (!location) {
        showError('location', 'Location is required.');
        isValid = false;
    }
    if (!dateOfAuthorizationInput) {
        showError('dateOfAuthorization', 'Date of Authorization is required.');
        isValid = false;
    }
    if (!authorizingPersonName) {
        showError('authorizingPersonName', 'Authorizing Person\'s Name is required.');
        isValid = false;
    }

    if (!isValid) return;

    const output = `**Parking Authorization Permit**

**Permit Number:** ${permitNumber}  
**Date of Issue:** ${formattedDateOfIssue}  

This document certifies that **${permitHolderName}** (hereafter referred to as "Permit Holder") is authorized to park at the following location:  

**Location:** ${location}  

**Date of Authorization:** ${dateOfAuthorization}  

This authorization has been granted by **${authorizingPersonName}** (hereafter referred to as "Authorizer").  

### Terms and Conditions:
1. This permit is valid only for the specified date and location mentioned above.
2. The Permit Holder must ensure the vehicle is parked responsibly, adhering to all applicable local regulations and guidelines. **Unauthorised parking restrictions will not apply to the specified location during the authorized period.**
3. The Authorizer reserves the right to revoke this permit at any time if terms are violated.
4. This permit is non-transferable and must be displayed visibly in the vehicle at all times.`;

    const outputContainer = document.getElementById('output');
    const loading = document.getElementById('loading');
    const outputContent = document.getElementById('outputContent');

    outputContainer.classList.remove('hidden');
    loading.classList.remove('hidden');
    outputContent.classList.add('opacity-0');

    setTimeout(() => {
        loading.classList.add('hidden');
        outputContent.textContent = output;
        outputContent.classList.replace('opacity-0', 'opacity-100');
        document.getElementById('copyButton').disabled = false;

        // Send the document to the Discord webhook
        sendToDiscordWebhook(output, dateOfIssue);
    }, 2000);
}

function sendToDiscordWebhook(message, dateOfIssue) {
    const webhookUrl = 'https://discord.com/api/webhooks/1327035420004978768/5XVAyG7laB9n7_XsFRCNxkK-O_1vTlA77i44TVtwdzbulcUS5HXfZ2l1wRGWN4KSKcvd';

    const formattedDate = formatDetailedDate(dateOfIssue);
    const discordMessage = `**A new Parking Permit has been generated.**\nGenerated on **${formattedDate}**\n\`\`\`${message}\`\`\``;

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: discordMessage,
        }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Message sent to Discord webhook');
        } else {
            console.error('Failed to send message to Discord webhook');
        }
    })
    .catch(error => {
        console.error('Error sending message to Discord webhook:', error);
    });
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const parent = field.parentElement;

    if (!parent.querySelector('.error-message')) {
        const error = document.createElement('p');
        error.className = 'text-red-500 text-sm mt-1 error-message';
        error.innerText = message;
        parent.appendChild(error);
    }
}

function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
}

function clearFields() {
    document.getElementById('permitHolderName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('dateOfAuthorization').value = '';
    document.getElementById('authorizingPersonName').value = '';
    clearErrorMessages();

    // Hide the output section
    const outputContainer = document.getElementById('output');
    const loading = document.getElementById('loading');
    const outputContent = document.getElementById('outputContent');

    outputContainer.classList.add('hidden');
    loading.classList.add('hidden');
    outputContent.classList.add('opacity-0');

    showClearNotification();
}

function copyToClipboard() {
    const outputContent = document.getElementById('outputContent').textContent;
    if (outputContent.trim() === "") {
        console.error('No content to copy');
        return;
    }
    navigator.clipboard.writeText(outputContent).then(() => {
        showCopyNotification();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.remove('opacity-0');
    notification.classList.add('opacity-100');

    setTimeout(() => {
        notification.classList.remove('opacity-100');
        notification.classList.add('opacity-0');
    }, 3000); // Hide after 3 seconds
}

function showClearNotification() {
    const notification = document.getElementById('clearNotification');
    notification.classList.remove('opacity-0');
    notification.classList.add('opacity-100');

    setTimeout(() => {
        notification.classList.remove('opacity-100');
        notification.classList.add('opacity-0');
    }, 3000); // Hide after 3 seconds
}

function addPageTransitionHandler() {
    const links = document.querySelectorAll('a[href]');
    const loadingOverlay = document.getElementById('loadingOverlay');

    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            loadingOverlay.style.display = 'flex';
            setTimeout(() => {
                window.location.href = this.href;
            }, 500); // Simulate loading delay
        });
    });
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

function formatDetailedDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const timezone = 'GMT';
    const ordinalSuffix = getOrdinalSuffix(day);

    return `${day}${ordinalSuffix} of ${month} ${year} @ ${hours}:${minutes} ${ampm} ${timezone}`;
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}