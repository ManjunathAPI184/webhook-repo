dayjs.extend(dayjs_plugin_relativeTime);
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);

document.addEventListener('DOMContentLoaded', () => {
    updateStats(0, 0, 0, 0);
});

function updateStats(total, push, pr, merged) {
    document.getElementById('totalEvents').textContent = total;
    document.getElementById('pushEvents').textContent = push;
    document.getElementById('prEvents').textContent = pr;
    document.getElementById('mergedPrs').textContent = merged;
}

function fetchEvents() {
    fetch("/events")
        .then(response => response.json())
        .then(data => {
            const eventsDiv = document.getElementById("events");
            eventsDiv.innerHTML = "";

            // Count statistics
            let total = 0;
            let pushCount = 0;
            let prCount = 0;
            let mergedCount = 0;

            data.forEach(event => {
                total++;
                
                const card = document.createElement("div");
                card.className = `event-card ${event.event_type} ${event.status === 'merged' ? 'merged' : ''}`;

                const relativeTime = dayjs.utc(event.timestamp).tz("Asia/Kolkata").fromNow();

                let content;
                
                if (event.event_type === 'pull_request') {
                    if (event.status === 'merged') {
                        mergedCount++;
                        content = `
                            <div class="event-type">Pull Request</div>
                            <div class="event-details">
                                <strong>Action:</strong> <span>${event.action}</span> <br>
                                <strong>Status:</strong> <span>Merged</span> <br>
                                <strong>Merged By:</strong> <span>${event.merged_by}</span>
                            </div>
                            <div class="event-time">${relativeTime}</div>
                        `;
                    } else {
                        prCount++;
                        content = `
                            <div class="event-type">Pull Request</div>
                            <div class="event-details">
                                <strong>Action:</strong> <span>${event.action}</span> <br>
                                <strong>Title:</strong> <span>${event.title}</span> <br>
                                <strong>From:</strong> <span>${event.from_branch}</span> <br>
                                <strong>To:</strong> <span>${event.to_branch}</span>
                            </div>
                            <div class="event-time">${relativeTime}</div>
                        `;
                    }
                } else {
                    pushCount++;
                    content = `
                        <div class="event-type">${event.event_type}</div>
                        <div class="event-details">
                            <strong>Author:</strong> <span>${event.author}</span> <br>
                            <strong>Branch:</strong> <span>${event.to_branch}</span>
                        </div>
                        <div class="event-time">${relativeTime}</div>
                    `;
                }

                card.innerHTML = content;
                eventsDiv.appendChild(card);
            });


            updateStats(total, pushCount, prCount, mergedCount);
        })
        .catch(error => {
            document.getElementById("events").innerHTML = 
                `<div class="event-card">
                    <div class="event-type">Error</div>
                    <div class="event-details">
                        <strong>Message:</strong> Failed to load events <br>
                        <strong>Error:</strong> ${error.message}
                    </div>
                </div>`;
            console.error(error);
        });
}

function clearEvents() {
    if (confirm('Are you sure you want to clear all events?')) {
        fetch("/clear-events", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                console.log("Cleared", data.deleted_count);
                updateStats(0, 0, 0, 0);
                fetchEvents();
            })
            .catch(error => {
                console.error("Error clearing events:", error);
                alert('Failed to clear events');
            });
    }
}

fetchEvents();
setInterval(fetchEvents, 15000);
