import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head'
import AppLayout from '../compontents/AppLayout';
import { Form, Input, Checkbox, Button } from 'antd';
import useInput from '../hooks/useInput';
import styled from 'styled-components';
import { IsNullOrEmpty } from '../commfunction/util';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router'
import { END } from 'redux-saga';
import wrapper from '../store/configureStore';
import axios from 'axios';

const ErrorMessage = styled.div`
    color: red;
`
const SucessMessage = styled.div`
    color: blue;
`;


const Signup = () => {
    const dispatch = useDispatch()
    const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user)

    useEffect(() => {
        if (me && me.id) {
            Router.replace('/');
        }
    }, [me && me.id])

    useEffect(() => {
        // 회원가입 성공시
        if (signUpDone) {
            Router.replace('/')

            dispatch({
                type: 'SIGN_UP_DONE_SUCCESS_INIT'
            })
        }
    }, [signUpDone])

    useEffect(() => {
        // 회원가입 실패시
        if (signUpError) {
            alert(signUpError);
        }
    }, [signUpError])

    const pwdCheckRef = useRef()

    const [passwordCheck, setPasswordCheck] = useState('')
    const [passwordError, setPasswordError] = useState(false)

    const [term, setTerm] = useState(false);
    const [termError, setTermError] = useState(false);

    const [email, onChangeEamil] = useInput('')
    const [nickname, onChangeNickname] = useInput('')
    const [password, onChangePassword] = useInput('', pwdCheckRef)

    let compare = true
    const [disableCheck, setDisableCheck] = useState(true)

    const onsubmit = useCallback(() => {
        if (password !== passwordCheck) {
            return setPasswordError(true)
        }
        if (!term) {
            return setTermError(true)
        }

        // 전부다 체크가 되었을때만..
        console.log(email, nickname, password)
        dispatch({
            type: SIGN_UP_REQUEST,
            data: { email, password, nickname }
        })
    }, [email, password, passwordCheck, term])

    const onChangePasswordCheck = useCallback((e) => {
        if (password === undefined || passwordCheck === null) {
            return null;
        }
        setPasswordCheck(e.target.value)
        setPasswordError(e.target.value !== password)
    }, [password])

    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, []);

    if (!IsNullOrEmpty(password) && !IsNullOrEmpty(passwordCheck)) {
        if (password !== passwordCheck) {
            compare = true
        } else {
            compare = false
        }
    }

    useEffect(() => {
        if (!IsNullOrEmpty(password)) {
            if (!IsNullOrEmpty(passwordCheck)) {
                if (term) {
                    setDisableCheck(false)
                } else {
                    setDisableCheck(true)
                }
            } else {
                setDisableCheck(true)
            }
        } else {
            setDisableCheck(true)
        }
    })
    return (
        <AppLayout>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>
            <Form onFinish={onsubmit} >
                <div>
                    <label htmlFor='user-email'>이메일</label>
                    <br />
                    <Input name='user-email' type="email" value={email} required onChange={onChangeEamil} />
                </div>
                <div>
                    <label htmlFor='user-nick'>닉네임</label>
                    <br />
                    <Input name='user-nick' value={nickname} required onChange={onChangeNickname} />
                </div>
                <div>
                    <label htmlFor='user-password'>비밀번호</label>
                    <br />
                    <Input type='password' name='user-password' value={password} required onChange={onChangePassword} />
                </div>
                <div>
                    <label htmlFor='user-password-check'>비밀번호체크</label>
                    <br />
                    <Input
                        ref={pwdCheckRef}
                        name='user-password-check'
                        type='password'
                        value={passwordCheck}
                        required
                        onChange={onChangePasswordCheck}
                    />
                    {
                        password === '' || passwordCheck === ''
                            ? <div></div>
                            : passwordCheck && password === ''
                                ? <div></div>
                                : passwordError || compare
                                    ? <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
                                    : <SucessMessage>비밀번호가 일치 합니다.</SucessMessage>
                    }
                </div>
                <div>
                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>OSH 말을 잘 들을 것을 동의합니다.</Checkbox>
                    {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
                </div>
                <div style={{ marginTop: 10 }}>
                    <Button disabled={disableCheck} type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
                </div>
            </Form>
        </AppLayout>
    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST
    });

    context.store.dispatch(END)
    await context.store.sagaTask.toPromise();
});

export default Signup;