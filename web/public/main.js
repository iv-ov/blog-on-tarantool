function show() {
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        const postsNode = document.getElementById('posts');
        let html = '';
        for (const post of posts) {
            html += `
                <h2>${post[1]}</h2>
                <time class="badge badge-info">${new Date(post[3] * 1000)}</time>
                <article>${post[2]}</article>
            `;
        }
        postsNode.innerHTML = html;
    }).catch(err => {
        console.log(err)
    });
}

show();

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
        show();
    }).catch(function (error) {
        console.log(error)
    })
})
