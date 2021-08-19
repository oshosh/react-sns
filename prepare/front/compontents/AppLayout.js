import React, { useMemo, useState } from 'react';
import Prototype from 'prop-types'
import Link from 'next/link'
import { Input, Menu, Row, Col } from 'antd'
import 'antd/dist/antd.css'
import styled, { createGlobalStyle, css } from 'styled-components'

import logo from '../img/logo.svg';
import changeLogo from '../img/logo_on.svg';

import UserProfile from '../compontents/UserProfile';
import LoginForm from '../compontents/LoginForm';

import { useSelector } from 'react-redux'

const Global = createGlobalStyle`
    .ant-row {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    .ant-col:first-child {
        padding-left: 0 !important;
    }
    .ant-col:last-child{
        padding-right: 0 !important;
    }
`

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
    const { me } = useSelector(state => state.user);
    return (
        <>
            <Global />
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
                        me
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