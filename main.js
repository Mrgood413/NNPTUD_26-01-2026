async function GetData() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        if (res.ok) {
            let posts = await res.json();
            let bodyTable = document.getElementById('body-table');
            bodyTable.innerHTML = '';
            for (const post of posts) {
                bodyTable.innerHTML += convertObjToHTML(post)
            }
        }
    } catch (error) {
        console.log(error);
    }
}
async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;

    // TRƯỜNG HỢP TẠO MỚI (ID TRỐNG)
    if (id === "") {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();

        let maxId = 0;
        for (let p of posts) {
            let numId = parseInt(p.id);
            if (numId > maxId) maxId = numId;
        }

        let newId = (maxId + 1).toString();

        await fetch('http://localhost:3000/posts', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        });
    } 
    // TRƯỜNG HỢP UPDATE
    else {
        await fetch('http://localhost:3000/posts/' + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views,
                isDeleted: false
            })
        });
    }

    GetData();
    return false;
}


function convertObjToHTML(post) {
    return `<tr>
    <td>${post.id}</td>
    <td>${post.title}</td>
    <td>${post.views}</td>
    <td><input type='submit' value='Delete' onclick='Delete(${post.id})'></td>
    </tr>`
}
async function Delete(id) {
    let res = await fetch('http://localhost:3000/posts/' + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    })

    if (res.ok) {
        GetData()
    }
}

GetData();
