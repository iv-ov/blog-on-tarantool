import React from 'react';

function Posts({ posts, deletePost, editPost, totalPages }) {
    return (
        <>{posts.length === 0
            ?
            <p>No posts yet. Feel free to post something <span role="img" aria-label="A green twig">🌿</span></p>
            :
            posts.map(post =>
                <div key={post}>
                    <h3>{post[1]} <sup>#{post[0]}</sup></h3>
                    <time className="badge badge-info">{new Date(post[3] * 1000).toLocaleString()}</time>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => editPost(post[0])}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deletePost(post[0])}>Delete</button>
                    <article>{post[2]}</article>
                </div>
            )}
            {totalPages > 1 ? <div><hr />(2 items per page)</div> : null}
        </>
    );
}

export default Posts;
