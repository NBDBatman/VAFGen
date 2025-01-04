document.addEventListener('DOMContentLoaded', function() {
    loadRanks();
});

function loadRanks() {
    const ranks = ["Judge", "Justice", "Chief Justice"];

    const judgeDropdown = document.getElementById('judge');
    judgeDropdown.innerHTML = '<option value="" disabled selected>Select Rank</option>';

    ranks.forEach(rank => {
        const option = document.createElement('option');
        option.value = rank;
        option.textContent = rank;
        judgeDropdown.appendChild(option);
    });
}

function generateDocument() {
    const registration = document.getElementById('registration').value || '[Blank]';
    const vin = document.getElementById('vin').value || '[Blank]';
    const partsInput = document.getElementById('parts').value || '[Blank]';
    const officerCallsign = document.getElementById('officerCallsign').value || '[Blank]';
    const officerName = document.getElementById('officerName').value || '[Blank]';
    const judgeDropdown = document.getElementById('judge');
    const judgeTitle = judgeDropdown.value || '[Blank]';
    const judgeName = document.getElementById('judgeName').value || '[Blank]';

    const partsList = partsInput
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `- ${line.trim()}`)
        .join('\n');

    const output = `# Vehicle Parts Transfer Confirmation

This document serves as official confirmation that the parts removed from the vehicle with registration number **${registration}** & VIN number **${vin}** have been lawfully seized and transferred to the **Unified Police Department (UPD)**.

## Vehicle Parts Seized:
${partsList || '[Blank]'}

## Signatories:
- **Receiving Officer/Deputy (on behalf of the UPD):** ${officerCallsign} ${officerName}
- **Authorizing Judge:** ${judgeTitle} ${judgeName}`;

    document.getElementById('output').innerHTML = `<pre class="whitespace-pre-wrap text-white">${output}</pre>`;
    document.getElementById('output').classList.remove('hidden');
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
    document.getElementById('output').classList.add('hidden');
}
