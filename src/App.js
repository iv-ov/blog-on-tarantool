import React, { useState, useEffect } from 'react';
import './App.css';
import Posts from './Posts';
import Pagination from './Pagination';
import PostForm from './PostForm';


const API_URL = 'http://localhost:8080';

function App() {
    const [data, setData] = useState({ items: [], totalPages: 0 });
    const [page, setPage] = useState(1);

    const [formData, setFormData] = useState({ title: '', text: '' });
    const [submitAllowed, setSubmitAllowed] = useState(true);

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
                }).catch(error => {
                    console.log(error);
                });
        },
        [page, lastUpdated],
    );

    const formRef = React.createRef();

    const onSubmit = (event) => {
        event.preventDefault();
        setSubmitAllowed(false);

        const formNode = formRef.current;

        fetch(`${API_URL}/posts/create`, {
            method: 'POST',
            body: JSON.stringify(formData),
        }).then(function (_response) {
            formNode.reset();
            setSubmitAllowed(true);
            signalizeChanges();
        }).catch(function (error) {
            setSubmitAllowed(true);
            console.log(error);
        })
    };

    function deletePost(id) {
        fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE'
        }).then(function (_response) {
            signalizeChanges();
        }).catch(function (error) {
            console.log(error);
        })
    }

    return (
        <div className="row">
            <div className="col">
                <h2>Add post</h2>
                <PostForm {...{ formData, setFormData, formRef, onSubmit, submitAllowed }} />
            </div>
            <div className="col">
                <h2>Posts</h2>
                {data.totalPages ? <Pagination {...{ page, setPage, totalPages: data.totalPages }} /> : null}
                <Posts {...{ posts: data.items, deletePost, totalPages: data.totalPages }} />
            </div>
        </div>
    );
}

export default App;
