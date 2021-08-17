import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head'
import AppLayout from '../compontents/AppLayout';
import { Form, Input, Checkbox, Button } from 'antd';
import useInput from '../hooks/useInput';
import styled from 'styled-components';

const ErrorMessage = styled.div`
    color: red;
`
const SucessMessage = styled.div`
    color: blue;
`;

function IsNullOrEmpty(str) {
    let isEmpty = false
    if (str === undefined || str === "" || str === Infinity || str === null || str === "null" || str === "undefined") {
        isEmpty = true
    } else if (typeof str === "string" && str.trim() === "") {
        isEmpty = true
    }

    return isEmpty
}

const Signup = () => {

    const pwdCheckRef = useRef()

    const [passwordCheck, setPasswordCheck] = useState('')
    const [passwordError, setPasswordError] = useState(false)

    const [term, setTerm] = useState(false);
    const [termError, setTermError] = useState(false);

    const [id, onChangeId] = useInput('')
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
        console.log(id, nickname, password)

    }, [password, passwordCheck, term])

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
                    <label htmlFor='user-id'>아이디</label>
                    <br />
                    <Input name='user-id' value={id} required onChange={onChangeId} />
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
                    <Button disabled={disableCheck} type="primary" htmlType="submit">가입하기</Button>
                </div>
            </Form>
        </AppLayout>
    );
}

export default Signup;