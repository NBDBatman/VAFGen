export function sendToDiscord(logData) {
    const webhookURL = 'https://discord.com/api/webhooks/1327035420004978768/5XVAyG7laB9n7_XsFRCNxkK-O_1vTlA77i44TVtwdzbulcUS5HXfZ2l1wRGWN4KSKcvd'; // Replace with your Discord webhook URL

    const logContent = `${logData.suspectName},

A vehicle registered to you received a VAF point. Please see the details below.

Vehicle: ${logData.vehicleModel} (${logData.vehiclePlate})
RO: ${logData.suspectName}
${logData.type}: #${logData.incidentNumber}
Reason: ${logData.reason}
Processing Officer: ${logData.processingOfficer}

This notification was shared with State ID (${logData.suspectID}) on ${logData.timestamp}`;

    const payload = {
        username: 'VAF Logger',
        embeds: [
            {
                title: 'VAF Notification Generated',
                description: `\`\`\`\n${logContent}\`\`\``,
                color: 5814783,
            },
        ],
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send log to Discord: ${response.statusText}`);
            }
            console.log('Log successfully sent to Discord');
        })
        .catch(console.error);
}
