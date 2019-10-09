
const postsNode = document.getElementById('posts');

function show() {
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        let html = '';
        for (const post of posts) {
            html += `
                <h2>${post[1]} <sup>#${post[0]}</sup></h2>
                <time class="badge badge-info">${new Date(post[3] * 1000)}</time>
                <button class="btn btn-sm btn-outline-danger" onClick="deletePost(${post[0]})">Delete</button>
                <article>${post[2]}</article>
            `;
        }
        postsNode.innerHTML = html;
    }).catch(err => {
        console.log(err)
    });
}

show();

function deletePost(id) {
    fetch(`/posts/${id}`, {
        method: 'DELETE'
    }).then(function (_response) {
        show();
    }).catch(function (error) {
        console.log(error)
    })
}

const addPostForm = document.getElementById('add-post-form');
addPostForm.addEventListener('submit', event => {
    event.preventDefault();
    const controls = document.querySelectorAll('input, textarea');
    const data = new URLSearchParams();
    Array.from(controls).forEach(el => {
        data.append(el.getAttribute('name'), el.value);
    });

    fetch('/posts/create', {
        method: 'POST',
        body: data
    }).then(function (_response) {
        addPostForm.reset();
        show();
    }).catch(function (error) {
        console.log(error)
    })
})
