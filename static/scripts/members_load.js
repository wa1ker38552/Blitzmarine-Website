function renderMember(member) {
    const e = dcreate("div", "member centered-vertically", `
        <img class="member-avatar" src="${member.avatar}">
        <div>
            <div class="centered-vertically">
                <span>${member.rank.name}</span>
            </div>
            <h3>${member.roblox}</h3>
        </div>
        <div class="member-right centered-vertically">
            <div>
                <h4>Joined ${new Date(member.joined * 1000).toLocaleDateString()}</h4>
                <h4>Region: ${member.region}</h4>
            </div>
        </div>
    `)
    e.onclick = function() {window.location.href = '/members/'+member.id}
    return e
}


window.onload = function() {
    const parent = dquery("#memberContainer")

    request("/api/members")
        .then(data => {
            // turn to list rq
            members = []
            for (m in data) {
                data[m].id = m
                members.push(data[m])
            }
            members.sort((a, b) => a.rank.index - b.rank.index)

            members.forEach(function(member) {
                parent.append(renderMember(member))
            })
        })
}