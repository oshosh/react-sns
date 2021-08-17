import React, { useMemo, useState } from 'react';
import Prototype from 'prop-types'
import Link from 'next/link'
import { Input, Menu, Row, Col } from 'antd'
import 'antd/dist/antd.css'
import styled, { css } from 'styled-components'

import logo from '../img/logo.svg';
import changeLogo from '../img/logo_on.svg';

import UserProfile from '../compontents/UserProfile';
import LoginForm from '../compontents/LoginForm';

import { useSelector } from 'react-redux'

const LogoContainter = styled.div`
    display: flex;
`;
const UrlLogo = styled.a`
    width: 32px;
    height: 32px;
    display: block;
    text-indent: -9999px;
    ${props =>
        props.img &&
        css`
            background-image: url(${props => props.img});
        `
    }

    &:hover{
        background-image: url(${changeLogo});
    }
`
const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`;
const LinkWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AppLayout = ({ children }) => {
    const { isLoggedIn } = useSelector(state => state.user);

    return (
        <>
            <Menu mode="horizontal">
                <Menu.Item key='1'>
                    <Link href='/'><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item key='2'>
                    <Link href='/profile'><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item key='3'>
                    <SearchInput enterButton />
                </Menu.Item>
                <Menu.Item key='4'>
                    {/* <Link href='/signup'><a>회원가입</a></Link> */}
                </Menu.Item>
            </Menu>

            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {
                        isLoggedIn
                            ? <UserProfile />
                            : <LoginForm />
                    }
                </Col>
                <Col xs={24} md={12}>
                    {/* 프로필 */}
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <LinkWrapper>
                        <a
                            style={useMemo(() => (
                                { marginBottom: '10px' }
                            ), [])}
                            href="https://blog.naver.com/qhanfckwsmsd"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Made by OSH
                        </a>

                        <LogoContainter className='gitLogoContainter'>
                            <UrlLogo
                                img={logo}
                                href="https://github.com/oshosh"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                Github
                            </UrlLogo>
                        </LogoContainter>
                    </LinkWrapper>
                </Col>
            </Row>

        </>
    );
}

export default AppLayout;

AppLayout.Prototype = {
    children: Prototype.node.isRequired,
}