import React from 'react';

const PostForm = ({ formData, setFormData, onSubmit, submitAllowed }) => {
    const onChangeTitle = (e) => {
        setFormData({ ...formData, title: e.target.value });
    };

    const onChangeText = (e) => {
        setFormData({ ...formData, text: e.target.value });
    };

    const cancelEditing = (e) => {
        setFormData({ id: null, title: '', text: '' });
    };

    const editMode = !!formData.id;

    return (
        <form onSubmit={onSubmit} id="add-post-form" action="/posts/create">
            {editMode ?
                <p className="text-danger">
                    You are editing post #{formData.id}
                    {' '}
                    <button onClick={cancelEditing} className="btn btn-outline-secondary btn-sm">Cancel editing</button>
                </p>
                :
                null
            }
            <div className="form-group">
                <label>Title
                    <input name="title" className="form-control" value={formData.title} onChange={onChangeTitle} size="60" />
                </label>
            </div>
            <div className="form-group">
                <label>Text
                    <textarea name="text" className="form-control" value={formData.text} onChange={onChangeText} cols="60" rows="8"></textarea>
                </label>
            </div>
            <div>
                <button type="submit" disabled={!submitAllowed} className="btn btn-primary">{editMode ? 'Save' : 'Post!'}</button>
            </div>
        </form>
    );
}

export default PostForm;
