document.addEventListener('DOMContentLoaded', function () {
    loadViolentCharges();
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

    const suspectName = document.getElementById('suspectName').value.trim();
    const vehicleModel = document.getElementById('vehicleModel').value.trim();
    const vehiclePlate = document.getElementById('vehiclePlate').value.trim();
    const type = document.getElementById('type').value;
    const incidentNumber = document.getElementById('incidentNumber').value.trim();
    const reason = document.getElementById('reason').value;
    const processingOfficer = document.getElementById('processingOfficer').value.trim();
    const suspectID = document.getElementById('suspectID').value.trim();

    if (!suspectName) showError('suspectName', 'Suspect Name is required.');
    if (!vehicleModel) showError('vehicleModel', 'Vehicle Model is required.');
    if (!vehiclePlate) showError('vehiclePlate', 'Vehicle Plate is required.');
    if (!reason) showError('reason', 'Reason is required.');
    if (!processingOfficer) showError('processingOfficer', 'Processing Officer is required.');
    if (!suspectID) showError('suspectID', 'Suspect ID is required.');

    if (document.querySelectorAll('.error-message').length) return;

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

    const output = `${suspectName},

A vehicle registered to you received a VAF point. Please see the details below.

Vehicle: ${vehicleModel} (${vehiclePlate})
RO: ${suspectName}
${type}: #${incidentNumber}
Reason: ${reason}
Processing Officer: ${processingOfficer}

This notification was shared with State ID (${suspectID}) on ${formattedDate} @ ${formattedTime}`;

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
    }, 2000);
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
    document.getElementById('output').classList.add('hidden');
}
