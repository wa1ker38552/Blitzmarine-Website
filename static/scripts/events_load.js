function renderEvent(event, members) {
    let host_id = (event.host) ? event.host.split('@')[1].slice(0, -1) : "??"
    members_ui = ""
    already_marked = []
    render_queue = []
    for (m of event.attendees) {
        try {
            m_id = m.split('@')[1].slice(0, -1)
            if (!already_marked.includes(m_id)) {
                already_marked.push(m_id)
                if (m_id in members) {
                    render_queue.push([
                        `<img class="event-member" title="${members[m_id].roblox}" src="${members[m_id].avatar}"></img>\n`,
                        members[m_id].rank.index
                    ])
                } else {
                    render_queue.push([
                        `<img class="event-member" title="${m_id}"></img>\n`,
                        999
                    ])
                }
            }
        } catch (Exception) {}
    }

    render_queue.sort((a, b) => a[1] - b[1])
    for (item of render_queue) {
        members_ui += item[0]
    }

    return dcreate("div", "event", `
        <div class="event-date">${new Date(event.timestamp * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        <h3 class="centered-vertically">${(new Date(event.timestamp * 1000) < new Date('2024-11-3')) ? "<span class='event-tag'>Legacy</span>" : ""}${(event.name) ? capitalize(event.name).replace("#", "") : "N/A"}</h3>
        <h4>Hosted by ${(host_id in members) ? members[host_id].roblox : "??"}</h4>
        <div class="event-right centered-vertically">
            <button onclick='window.location.href = "/events/${event.id}"'>View More</button>
        </div>
    `)
    /*
    <div style='text-align: right'>
        <h4>${event.date}</h4>
        <h4>Attendance ${event.attendees.length}</h4>
    </div>
    <div class="event-right centered-vertically">
            <div class="event-members">
                ${members_ui}
            </div>
        </div>
    */
}


window.onload = function() {
    const parent = dquery("#eventsContainer")

    request("/api/events")
        .then(event_data => {
            request("/api/members")
                .then(members_data => {
                    // handle shit here
                    events = []
                    for (e in event_data) {
                        events.push(event_data[e])
                    }
                    events.sort((a, b) => a.timestamp - b.timestamp)
                    events.reverse()

                    events.forEach(function(event) {
                        parent.append(renderEvent(event, members_data))
                    })
                })
        })
}