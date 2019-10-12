import React, { useState, useEffect } from 'react';
import './App.css';
import Posts from './Posts';
import Pagination from './Pagination';
import PostForm from './PostForm';


const API_URL = 'http://localhost:8080';

function App() {
    const [data, setData] = useState({items:[], totalPages: 0});
    const [page, setPage] = useState(1);

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

        const data = {};
        //@TODO we wanted to be quick and dirty, fix this
        const controls = document.querySelectorAll('input, textarea');
        Array.from(controls).forEach(el => {
            data[el.getAttribute('name')] = el.value;
        });

        const formNode = formRef.current;

        fetch(`${API_URL}/posts/create`, {
            method: 'POST',
            body: JSON.stringify(data),
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
                <PostForm {...{formRef, onSubmit, submitAllowed}} />
            </div>
            <div className="col">
                <h2>Posts</h2>
                {data.totalPages ? <Pagination {...{page, setPage, totalPages: data.totalPages}} /> : null}
                <Posts {...{posts: data.items, deletePost}} />
            </div>
        </div>
    );
}

export default App;