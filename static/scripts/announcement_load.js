function replaceMentions(content, mentions) {
    for (mention of mentions) {
        content = content.replaceAll(`<@${mention.id}>`, `<span class="mention">@${mention.name}</span>`)
    }

    content = content.replaceAll("@everyone", "<span class='mention'>@everyone</span>")
    content = content.replaceAll("@here", "<span class='mention'>@here</span>")
    content = content.replaceAll("<@&1255650878485037178>", "<span class='mention'>@announcements</span>") // announcement id on old server :)

    // additional formatting
    content = content.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    content = content.replace(/\*(.*?)\*/g, "<i>$1</i>")
    content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
    content = content.replace(/\|\|(.*?)\|\|/g, "<span class='spoiler spoiler-hide' onclick='(this.classList.contains(`spoiler-hide`)) ? this.classList.remove(`spoiler-hide`) : this.classList.add(`spoiler-hide`)'>$1</span>");
    return content
}

function renderAnnouncement(message, members) {
    message_author = message.author.id.toString()
    reactionUi = ""

    for (reaction of message.reactions) {
        reactionUi += `<div class='reaction'>${reaction.name} ${reaction.count}</div>`
    }

    const e = dcreate("div", "announcement", `
        <a class="announcement-header centered-vertically" href="/members/${message_author}">
            <img src="${(message_author in members) ? members[message_author].avatar : ""}">
            <h3>${(message_author in members) ? members[message_author].roblox : message_author}</h3>
            <h4>${new Date(message.timestamp * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${relativeTime(message.timestamp * 1000)})</h4>
        </a>
        <pre class="announcement-content">${replaceMentions(message.content, message.mentions)}</pre>
        ${(message.reactions) ? "<div class='gap'></div>" : ""}
        ${(message.reactions) ? "<div class='reactions-container centered-vertically'>" : ""}
        ${reactionUi}
        ${(message.reactions) ? "</div>" : ""}
    `)
    return e
}

window.onload = function() {
    const parent = dquery("#announcementsContainer")
    request("/api/announcements")
        .then(announcements => {
            request("/api/members")
                .then(members => {
                    announcements.forEach(function(message) {
                        parent.append(renderAnnouncement(message, members))
                    })
                    dquery("#announcementAmount").textContent = announcements.length
                })
        })
}