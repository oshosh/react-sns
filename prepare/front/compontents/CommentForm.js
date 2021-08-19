import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

function CommentForm({ post }) {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id);
    const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);

    const [commentText, onChangeCommentText, setCommentText] = useInput('');

    useEffect(() => {
        if (addCommentDone) {
            setCommentText('')
        }
    }, [addCommentDone])

    const onsubmitComment = useCallback(() => {
        console.log(post.id, commentText);
        dispatch({
            type: ADD_COMMENT_REQUEST,
            data: { content: commentText, postId: post.id, useId: id },
        });
    }, [commentText, id])

    return (
        <Form onFinish={onsubmitComment}>
            <Form.Item style={{ position: 'relative', margin: '0px' }}>
                <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={6} />
                <Button style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }} loading={addCommentLoading} type='primary' htmlType='submit'>삐약</Button>
            </Form.Item>
        </Form>
    );
}

CommentForm.prototype = {
    post: PropTypes.object.isRequired,
};

export default CommentForm;