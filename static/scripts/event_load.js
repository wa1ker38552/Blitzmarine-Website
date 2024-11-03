function renderEventAttendee(mid, members) {
    const e = dcreate("a", "attendance-member centered-vertically", `
        <img src="${(mid in members) ? members[mid].avatar : ""}">
        <div>
            <div class="attendee-rank">${(mid in members) ? members[mid].rank.name : "??"}</div>
            <h3>${(mid in members) ? members[mid].roblox : mid}</h3>
        </div>
    `)
    e.href = "/members/"+mid
    return e
}

window.onload = function() {
    const parent = dquery("#attendanceContainer")

    request("/api/events/"+eid)
        .then(event => {
            request("/api/members")
                .then(members => {
                    let host_id = (event.host) ? event.host.split('@')[1].slice(0, -1) : "??"

                    dquery("#eventName").textContent = (event.name) ? capitalizeAll(event.name.replace("#", "")) : "Unknown Event"
                    dquery("#eventHost").textContent = (host_id in members) ? members[host_id].roblox : host_id
                    dquery("#eventHost").href = "/members/"+host_id
                    dquery("#eventDate").textContent = `${new Date(event.timestamp * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${relativeTime(event.timestamp * 1000)})`
                    dquery("#eventDuration").textContent = event.duration
                    dquery("#eventNotes").textContent = (event.note) ? event.note : "N/A"
                    dquery("#eventAttendance").textContent = event.attendees.length

                    already_marked = []
                    render_queue = []
                    for (m of event.attendees) {
                        try {
                            m_id = m.split('@')[1].slice(0, -1)
                            if (!already_marked.includes(m_id)) {
                                already_marked.push(m_id)
                                if (m_id in members) {
                                    render_queue.push([
                                        renderEventAttendee(m_id, members),
                                        members[m_id].rank.index
                                    ])
                                } else {
                                    render_queue.push([
                                        renderEventAttendee(m_id, members),
                                        999
                                    ])
                                }
                            }
                        } catch (Exception) {}
                    }

                    render_queue.sort((a, b) => a[1] - b[1])
                    for (item of render_queue) {
                        parent.append(item[0])
                    }

                    const imageContainer = dquery("#eventGallery")
                    for (attachment of event.attachments) {
                        const e = dcreate("img")
                        e.src = attachment
                        e.onclick = function() {window.open(attachment, "_blank")}
                        imageContainer.append(e)
                    }
                })
        })
}