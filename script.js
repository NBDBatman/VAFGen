document.addEventListener('DOMContentLoaded', function () {
    loadRanks();
    loadDepartments();
    addTestFillHandler();
});

function loadRanks() {
    const ranks = ["Magistrate", "Judge", "Justice", "Chief Justice"];

    const judgeDropdown = document.getElementById('judge');
    judgeDropdown.innerHTML = '<option value="" disabled selected>Select Rank</option>';

    ranks.forEach(rank => {
        const option = document.createElement('option');
        option.value = rank;
        option.textContent = rank;
        judgeDropdown.appendChild(option);
    });
}

function loadDepartments() {
    const departments = [
        { value: "LSPD", text: "Los Santos Police Department (LSPD)" },
        { value: "BCSO", text: "Blaine County Sheriff's Office (BCSO)" },
        { value: "SASM", text: "San Andreas State Marshals (SASM)" }
    ];

    const departmentDropdown = document.getElementById('department');
    departmentDropdown.innerHTML = '<option value="" disabled selected>Select Department</option>';

    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.value;
        option.textContent = dept.text;
        departmentDropdown.appendChild(option);
    });
}

function addTestFillHandler() {
    const testFillButton = document.getElementById('testFill');
    testFillButton.addEventListener('click', function () {
        document.getElementById('registration').value = "NZL6CSFQ";
        document.getElementById('vin').value = "3SRSP41PG4M079533";
        document.getElementById('parts').value = `1x 98mm Turbo
1x 8-Speed Sequential Gearbox
1x Stage 3 Brakes
1x Stage 3 Dump Valve
1x Stage 4 Coilovers
1x Stage 5 Swaybars
1x Stage 4 Dampeners
1x Stage 3 Weight Reduction
1x Stage 3 Clutch Plate
Full Set of Slick Tires`;
        document.getElementById('officerCallsign').value = "369";
        document.getElementById('officerName').value = "Mike Blunt";
        document.getElementById('judge').value = "Magistrate";
        document.getElementById('judgeName').value = "Nathan Barr";
        document.getElementById('department').value = "LSPD";
    });
}

function generateDocument() {
    // Clear previous error messages
    clearErrorMessages();

    // Gather field values
    const registration = document.getElementById('registration').value.trim();
    const vin = document.getElementById('vin').value.trim();
    const partsInput = document.getElementById('parts').value.trim();
    const officerCallsign = document.getElementById('officerCallsign').value.trim();
    const officerName = document.getElementById('officerName').value.trim();
    const judgeDropdown = document.getElementById('judge').value;
    const judgeName = document.getElementById('judgeName').value.trim();
    const department = document.getElementById('department').value;

    // Validate fields
    let isValid = true;

    if (!registration) {
        showError('registration', 'Vehicle Registration Number is required.');
        isValid = false;
    }
    if (!vin) {
        showError('vin', 'VIN Number is required.');
        isValid = false;
    }
    if (!partsInput) {
        showError('parts', 'Vehicle Parts Seized is required.');
        isValid = false;
    }
    if (!officerCallsign) {
        showError('officerCallsign', 'Callsign is required.');
        isValid = false;
    }
    if (!officerName) {
        showError('officerName', "Officer's Full Name is required.");
        isValid = false;
    }
    if (!judgeDropdown) {
        showError('judge', 'Rank of Judge is required.');
        isValid = false;
    }
    if (!judgeName) {
        showError('judgeName', "Judge's Name is required.");
        isValid = false;
    }
    if (!department) {
        showError('department', 'Department is required.');
        isValid = false;
    }

    // Stop if any field is invalid
    if (!isValid) return;

    // Get the current date in the format "5th of January 2025"
    const currentDate = formatDate(new Date());

    let departmentShortName = '';
    let receivingTitle = '';

    if (department === 'LSPD') {
        departmentShortName = 'LSPD';
        receivingTitle = 'Receiving Officer';
    } else if (department === 'BCSO') {
        departmentShortName = 'BCSO';
        receivingTitle = 'Receiving Deputy';
    } else if (department === 'SASM') {
        departmentShortName = 'SASM';
        receivingTitle = 'Receiving Marshal';
    }

    const partsList = partsInput
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `- ${line.trim()}`)
        .join('\n');

    const output = `# Vehicle Parts Transfer Confirmation (${currentDate})

This document serves as official confirmation that the parts removed from the vehicle with registration number **${registration}** & VIN number **${vin}** have been lawfully seized and transferred to the **${department === 'LSPD' ? 'Los Santos Police Department (LSPD)' : department === 'BCSO' ? "Blaine County Sheriff's Office (BCSO)" : 'San Andreas State Marshals (SASM)'}**.

## Vehicle Parts Seized:
${partsList}

## Signatories:
- **${receivingTitle} (on behalf of ${departmentShortName}):** ${officerCallsign} ${officerName}
- **Authorizing Judge:** ${judgeDropdown} ${judgeName}`;

    document.getElementById('output').innerHTML = `<pre class="whitespace-pre-wrap text-white">${output}</pre>`;
    document.getElementById('output').classList.remove('hidden');
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const ordinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${day}${ordinal(day)} of ${month} ${year}`;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const parent = field.parentElement;

    // Check if an error message already exists
    if (!parent.querySelector('.error-message')) {
        const error = document.createElement('p');
        error.className = 'text-red-500 text-sm mt-1 error-message';
        error.innerText = message;
        parent.appendChild(error);
    }
}

function clearErrorMessages() {
    // Remove only error messages (not labels or the red `*`)
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}

function copyToClipboard() {
    const output = document.querySelector('#output pre');
    if (output) {
        const range = document.createRange();
        range.selectNodeContents(output);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
    }
}

function clearFields() {
    document.getElementById('registration').value = '';
    document.getElementById('vin').value = '';
    document.getElementById('parts').value = '';
    document.getElementById('officerCallsign').value = '';
    document.getElementById('officerName').value = '';
    document.getElementById('judge').value = '';
    document.getElementById('judgeName').value = '';
    document.getElementById('department').value = '';
    document.getElementById('output').classList.add('hidden');
    clearErrorMessages();
}
