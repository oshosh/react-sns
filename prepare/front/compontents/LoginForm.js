import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
    margin-top: 10px;
`;
const FormWrapper = styled(Form)`
    padding: 10px;
`;
const LoginForm = () => {
    const dispatch = useDispatch();
    const { logInLoading, logInError } = useSelector(state => state.user)
    const [email, onChangeEamil] = useInput('')     // custom hook
    const [password, onChangePassword] = useInput('')

    useEffect(() => {
        if (logInError) {
            alert(logInError);
        }
    }, [logInError])

    const onSubmitForm = useCallback(() => {
        console.log(email, password)
        // setIsLoggedIn(true)

        dispatch(loginRequestAction({
            email, password
        }))
    }, [email, password])

    return (
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor='user-email'>이메일</label>
                <br />
                <Input
                    name="user-email"
                    value={email}
                    type='email'
                    onChange={onChangeEamil}
                    required
                />
            </div>

            <div>
                <label htmlFor='user-password'> 비밀번호</label>
                <br />
                <Input
                    name="user-password"
                    type='password'
                    value={password}
                    onChange={onChangePassword}
                    required
                />
            </div>

            <ButtonWrapper>
                <Button
                    type='primary'
                    htmlType='submit'
                    loading={logInLoading}
                >
                    로그인
                </Button>
                <Link href='/signup'>
                    <a><Button>회원가입</Button></a>
                </Link>
            </ButtonWrapper>
        </FormWrapper>
    );
}
LoginForm.prototype = {
    setIsLoggedIn: PropTypes.func.isRequired
}

export default LoginForm;