function renderEvent(event) {
    const e = dcreate("div", "attended-event", `
        <h4>${new Date(event.timestamp * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h4>
        <h3>${(event.name) ? capitalizeAll(event.name) : "N/A"}</h3>
        <div class="event-right centered-vertically">
            <button onclick='window.location.href = "/events/${event.id}"'>View More</button>
        </div>
    `)
    return e
}


window.onload = function() {
    const eventContainer = dquery("#attendedContainer")
    const hostsContainer = dquery("#hostsContainer")
    request("/api/members/"+mid)
        .then(member => {
            request("/api/events")
                .then(events => {
                    dquery("#memberRank").textContent = member.rank.name
                    dquery("#memberName").textContent = member.roblox
                    dquery("#memberJoined").textContent = `${new Date(member.joined * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${relativeTime(new Date(member.joined * 1000))})`
                    dquery("#memberRobloxName").textContent = member.roblox
                    dquery("#memberDiscordName").textContent = member.name

                    let participating = []
                    let hosts = []
                    for (e in events) {
                        al = []
                        try {
                            hostId = events[e].host.split('@')[1].slice(0, -1)
                            if (hostId.includes(mid)) {
                                hosts.push(events[e])
                            }
                        } catch (Exception) {}
                        
                        for (a of events[e].attendees) {
                            try {
                                al.push(a.split('@')[1].slice(0, -1))
                            } catch (Exception) {}
                        }

                        if (al.includes(mid)) {
                            participating.push(events[e])
                        }
                    }

                    participating.sort((a, b) => a.timestamp - b.timestamp)
                    participating.reverse()
                    dquery("#attendedAmount").textContent = participating.length

                    participating.forEach(function(event) {
                        eventContainer.append(renderEvent(event))
                    })

                    hosts.sort((a, b) => a.timestamp - b.timestamp)
                    hosts.reverse()
                    dquery("#hostAmount").textContent = hosts.length

                    hosts.forEach(function(event) {
                        hostsContainer.append(renderEvent(event))
                    })
                })
        })
}