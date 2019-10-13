import React, { useState, useEffect } from 'react';
import './App.css';
import Posts from './Posts';
import Pagination from './Pagination';
import PostForm from './PostForm';


const API_URL = 'http://localhost:8080';

function App() {
    const [data, setData] = useState({ items: [], totalPages: 0 });
    const [page, setPage] = useState(1);

    const [formData, setFormData] = useState({ id: null, title: '', text: '' });
    const [submitAllowed, setSubmitAllowed] = useState(true);

    // Hey-hey! We've found a nice use case for "null"!
    const [error, _setError] = useState(null);
    const setError = (error) => {
        _setError(error);
        error && console.error(error);
    };

    // Just an indicator that the data is changed by the user and we need to download the latest data
    const [lastUpdated, setLastUpdated] = useState(0);
    const signalizeChanges = () => setLastUpdated(Date.now());

    // Load posts when page number or data changes (user created or deleted a post)
    useEffect(
        () => {
            fetch(`${API_URL}/posts?page=${page}`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                    if (data.totalPages < page) {
                        // Remember not to set page to 0
                        setPage(data.totalPages || 1);
                    }
                    setError(null);
                }).catch(error => {
                    setError(error);
                });
        },
        [page, lastUpdated],
    );


    const onSubmit = (event) => {
        event.preventDefault();
        setSubmitAllowed(false);

        let url = `${API_URL}/posts/create`;
        let method = 'POST';
        // For edit mode
        if (formData.id) {
            url = `${API_URL}/posts/${formData.id}`;
            method = 'PUT';
        }

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(function (_response) {
            setFormData({ id: null, title: '', text: '' });
            setSubmitAllowed(true);
            signalizeChanges();
            setError(null);
        }).catch(function (error) {
            setSubmitAllowed(true);
            setError(error);
        })
    };

    function deletePost(id) {
        fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE'
        }).then(function (_response) {
            signalizeChanges();
            setError(null);
        }).catch(function (error) {
            setError(error);
        })
    }

    function editPost(id) {
        const post = data.items.find(post => post[0] === id);
        setFormData({
            id: post[0],
            title: post[1],
            text: post[2],
        });
    }

    return <>
        {error ? <p className="text-danger">{error.toString()}</p> : null}
        <div className="row">
            <div className="col">
                <h2>Add post</h2>
                <PostForm {...{ formData, setFormData, onSubmit, submitAllowed }} />
            </div>
            <div className="col">
                <h2>Posts</h2>
                {data.totalPages ? <Pagination {...{ page, setPage, totalPages: data.totalPages }} /> : null}
                <Posts {...{ posts: data.items, editPost, deletePost, totalPages: data.totalPages }} />
            </div>
        </div>
    </>;
}

export default App;
