function show() {
    fetch('/posts')
    .then(response => response.json())
    .then(data => {
        var postsNode = document.getElementById('posts');
        let html = '';
        for (const x of data) {
            html += `
                <h2>${x[1]}</h2>
                <time>${new Date(x[3] * 1000)}</time>
                <article>${x[2]}</article>
            `;
        }
        postsNode.innerHTML = html;

    }).catch(err => {
        console.log(err)
    });
}

show();

let addPostForm = document.getElementById('add-post-form');
addPostForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let controls = document.querySelectorAll('input, textarea');
    let data = new URLSearchParams();
    Array.from(controls).forEach(el => {
        data.append(el.getAttribute('name'), el.value);
    });

    fetch('/posts/create', {
        method: 'POST',
        body: data
    }).then(function (response) {
        show();
    }).catch(function (error) {
        console.log(error)
    })
})

