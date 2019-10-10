
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
    }).catch(error => {
        console.log(error);
    });
}

show();

function deletePost(id) {
    fetch(`/posts/${id}`, {
        method: 'DELETE'
    }).then(function (_response) {
        show();
    }).catch(function (error) {
        console.log(error);
    })
}


const addPostForm = document.getElementById('add-post-form');
const controls = document.querySelectorAll('input, textarea');
const submitButton = document.querySelector('[type="submit"]');

const setSubmitEnabled = (doEnable) => {
    if (doEnable) {
        submitButton.removeAttribute('disabled');
    } else {
        submitButton.setAttribute('disabled', '');
    };
};

addPostForm.addEventListener('submit', event => {
    event.preventDefault();
    setSubmitEnabled(false);

    const data = {};
    Array.from(controls).forEach(el => {
        data[el.getAttribute('name')] = el.value;
    });

    fetch('/posts/create', {
        method: 'POST',
        body: JSON.stringify(data),
    }).then(function (_response) {
        addPostForm.reset();
        setSubmitEnabled(true);
        show();
    }).catch(function (error) {
        setSubmitEnabled(true);
        console.log(error);
    })
});
