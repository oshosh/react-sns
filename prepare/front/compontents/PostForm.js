import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { addPost, ADD_POST_REQUEST } from '../reducers/post';

function PostForm() {
    const { imagePaths, addPostDone } = useSelector(state => state.post)
    const imageInput = useRef()
    const dispatch = useDispatch();

    const [text, onChangeText, setText] = useInput('');

    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone])

    const onClickImageUpload = useCallback((e) => {
        imageInput.current.click()
    }, [imageInput.current])

    const onSubmitForm = useCallback(() => {
        if (!text || !text.trim()) {
            return alert('게시글을 작성하세요.');
        }

        return dispatch({
            type: ADD_POST_REQUEST,
            data: text,
        });
    }, [text])

    return (
        <Form
            onFinish={onSubmitForm}
            style={{
                margin: '10px 0 20px'
            }}
            encType='multipart/form-data'
        >
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder='어떤 신기한 일이 있었나요?'
            />
            <div>
                <input type='file' multiple hidden ref={imageInput} />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type='primary' style={{ float: 'right' }} htmlType='submit'>짹짹</Button>
            </div>
            <div>
                {
                    imagePaths.map((v) => {
                        <div key={v} style={{ display: 'inline-block' }}>
                            <img src={v} style={{ width: '200px' }} alt={v} />
                            <div>
                                <Button>제거</Button>
                            </div>
                        </div>
                    })
                }
            </div>
        </Form>
    );
}

export default PostForm;