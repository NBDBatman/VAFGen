document.addEventListener('DOMContentLoaded', function () {
    loadViolentCharges();
    addPageTransitionHandler();
});

function loadViolentCharges() {
    fetch('violent_charges.json')
        .then(response => response.json())
        .then(data => {
            const charges = data.violent_charges;
            const reasonDropdown = document.getElementById('reason');

            charges.forEach(charge => {
                const option = document.createElement('option');
                option.value = charge;
                option.textContent = charge;
                reasonDropdown.appendChild(option);
            });
        })
        .catch(console.error);
}

function generateNotification() {
    clearErrorMessages();

    // Gather field values
    const suspectName = document.getElementById('suspectName').value.trim();
    const vehicleModel = document.getElementById('vehicleModel').value.trim();
    const vehiclePlate = document.getElementById('vehiclePlate').value.trim();
    const type = document.getElementById('type').value;
    const incidentNumber = document.getElementById('incidentNumber').value.trim();
    const reason = document.getElementById('reason').value;
    const processingOfficer = document.getElementById('processingOfficer').value.trim();
    const suspectID = document.getElementById('suspectID').value.trim();

    // Validate inputs
    if (!suspectName || !vehicleModel || !vehiclePlate || !reason || !processingOfficer || !suspectID) {
        // Show error messages if any field is empty
        if (!suspectName) showError('suspectName', 'Suspect Name is required.');
        if (!vehicleModel) showError('vehicleModel', 'Vehicle Model is required.');
        if (!vehiclePlate) showError('vehiclePlate', 'Vehicle Plate is required.');
        if (!reason) showError('reason', 'Reason is required.');
        if (!processingOfficer) showError('processingOfficer', 'Processing Officer is required.');
        if (!suspectID) showError('suspectID', 'Suspect ID is required.');
        return;
    }

    // Generate date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { timeZone: 'UTC' });
    const timeOptions = {
        timeZoneName: 'short',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
    };
    const timeParts = now
        .toLocaleTimeString('en-US', timeOptions)
        .split(' ');
    const formattedTime = `${timeParts[0]} ${timeParts[1]} (${timeParts[2]})`;

    // Generate output content
    const output = `${suspectName},

A vehicle registered to you received a VAF point. Please see the details below.

Vehicle: ${vehicleModel} (${vehiclePlate})
RO: ${suspectName}
${type}: #${incidentNumber}
Reason: ${reason}
Processing Officer: ${processingOfficer}

This notification was shared with State ID (${suspectID}) on ${formattedDate} @ ${formattedTime}`;

    // Display output in the UI
    const outputContent = document.getElementById('outputContent');
    const outputContainer = document.getElementById('output');
    const loading = document.getElementById('loading');

    outputContent.textContent = output;

    // Show loading animation
    loading.classList.remove('hidden');
    outputContainer.classList.remove('hidden');
    outputContent.classList.add('opacity-0');

    // Enable the copy button
    document.getElementById('copyButton').disabled = false;

    // Simulate generation delay and display document
    setTimeout(() => {
        loading.classList.add('hidden');
        outputContent.classList.remove('opacity-0');
    }, 2000);

    // Log to Discord webhook
    sendToDiscordWebhook(output, formattedDate, formattedTime);
}

function sendToDiscordWebhook(message, date, time) {
    const webhookUrl = "https://discord.com/api/webhooks/1327035420004978768/5XVAyG7laB9n7_XsFRCNxkK-O_1vTlA77i44TVtwdzbulcUS5HXfZ2l1wRGWN4KSKcvd";

    const content = `**A new VAF notification has been generated.**\nGenerated on: **${date} @ ${time}**\n\`\`\`${message}\`\`\``;

    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed to send message to Discord webhook:", response.statusText);
        } else {
            console.log("Message sent to Discord webhook successfully.");
        }
    })
    .catch(console.error);
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
    document.getElementById('suspectName').value = '';
    document.getElementById('vehicleModel').value = '';
    document.getElementById('vehiclePlate').value = '';
    document.getElementById('type').value = 'Incident';
    document.getElementById('incidentNumber').value = '';
    document.getElementById('reason').value = '';
    document.getElementById('processingOfficer').value = '';
    document.getElementById('suspectID').value = '';
    clearErrorMessages();

    // Hide the output section
    const outputContainer = document.getElementById('output');
    const loading = document.getElementById('loading');
    const outputContent = document.getElementById('outputContent');

    outputContainer.classList.add('hidden');
    loading.classList.add('hidden');
    outputContent.classList.add('opacity-0');
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
