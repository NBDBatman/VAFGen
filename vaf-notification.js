document.addEventListener('DOMContentLoaded', function () {
    loadViolentCharges();
});

function loadViolentCharges() {
    fetch('violent_charges.json') // Ensure this JSON file is in the same directory
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load violent_charges.json: ${response.statusText}`);
            }
            return response.json();
        })
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
        .catch(error => console.error('Error loading charges:', error));
}

function generateNotification() {
    clearErrorMessages();

    const suspectName = document.getElementById('suspectName').value.trim();
    const vehicleModel = document.getElementById('vehicleModel').value.trim();
    const vehiclePlate = document.getElementById('vehiclePlate').value.trim();
    const type = document.getElementById('type').value;
    const incidentNumber = document.getElementById('incidentNumber').value.trim();
    const reason = document.getElementById('reason').value;
    const suspectID = document.getElementById('suspectID').value.trim();

    if (!suspectName) showError('suspectName', 'Suspect Name is required.');
    if (!vehicleModel) showError('vehicleModel', 'Vehicle Model is required.');
    if (!vehiclePlate) showError('vehiclePlate', 'Vehicle Plate is required.');
    if (!incidentNumber) showError('incidentNumber', `${type} Number is required.`);
    if (!reason) showError('reason', 'Reason is required.');
    if (!suspectID) showError('suspectID', 'Suspect ID is required.');

    if (document.querySelectorAll('.error-message').length) return;

    const output = `${suspectName},

A vehicle registered to you received a VAF point. Please see the details below.

Vehicle: ${vehicleModel} (${vehiclePlate})
Date: ${formatDate(new Date())}
RO: ${suspectName}
${type}: #${incidentNumber}
Reason: ${reason}
Processing Officer: 

This notification was shared with State ID (${suspectID}) on ${formatDate(new Date())} @ ${formatTime(new Date())} (${getTimeZoneAbbreviation()})`;

    document.getElementById('output').innerHTML = `<pre class="whitespace-pre-wrap text-white">${output}</pre>`;
    document.getElementById('output').classList.remove('hidden');
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function formatTime(date) {
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function getTimeZoneAbbreviation() {
    const date = new Date();
    const options = { timeZoneName: 'short' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    return timeZonePart ? timeZonePart.value : 'GMT';
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
    document.getElementById('suspectID').value = '';
    clearErrorMessages();
    document.getElementById('output').classList.add('hidden');
}
