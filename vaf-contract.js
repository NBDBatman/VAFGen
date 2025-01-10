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
    clearErrorMessages();

    const registration = document.getElementById('registration').value.trim();
    const vin = document.getElementById('vin').value.trim();
    const partsInput = document.getElementById('parts').value.trim();
    const officerCallsign = document.getElementById('officerCallsign').value.trim();
    const officerName = document.getElementById('officerName').value.trim();
    const judgeDropdown = document.getElementById('judge').value;
    const judgeName = document.getElementById('judgeName').value.trim();
    const department = document.getElementById('department').value;

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

    if (!isValid) return;

    const currentDate = formatDate(new Date());
    const departmentDetails = getDepartmentDetails(department);
    const partsList = partsInput.split('\n').map(line => `- ${line.trim()}`).join('\n');

    const output = `# Vehicle Parts Transfer Confirmation (${currentDate})

This document serves as official confirmation that the parts removed from the vehicle with registration number **${registration}** & VIN number **${vin}** have been lawfully seized and transferred to the **${departmentDetails.fullName}**.

## Vehicle Parts Seized:
${partsList}

## Signatories:
- **${departmentDetails.title} (on behalf of ${departmentDetails.shortName}):** ${officerCallsign} ${officerName}
- **Authorizing ${judgeDropdown}:** ${judgeName}`;

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
        sendToDiscord(output, currentDate);
    }, 2000);
}

function sendToDiscord(content, date) {
    const webhookUrl = "https://discord.com/api/webhooks/1327035420004978768/5XVAyG7laB9n7_XsFRCNxkK-O_1vTlA77i44TVtwdzbulcUS5HXfZ2l1wRGWN4KSKcvd";

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });

    const message = `**A new Parts Transfer Contract has been generated.**\nGenerated on **${date} @ ${timeString}**\n\`\`\`${content}\`\`\``;

    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
    }).catch(console.error);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const ordinal = (n) => ["th", "st", "nd", "rd"][(n % 10 > 3 || Math.floor(n % 100 / 10) === 1) ? 0 : n % 10];

    return `${day}${ordinal(day)} of ${month} ${year}`;
}

function getDepartmentDetails(department) {
    if (department === "LSPD") return { fullName: "Los Santos Police Department (LSPD)", shortName: "LSPD", title: "Receiving Officer" };
    if (department === "BCSO") return { fullName: "Blaine County Sheriff's Office (BCSO)", shortName: "BCSO", title: "Receiving Deputy" };
    if (department === "SASM") return { fullName: "San Andreas State Marshals (SASM)", shortName: "SASM", title: "Receiving Marshal" };
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
