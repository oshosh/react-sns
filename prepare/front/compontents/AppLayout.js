import React from 'react';
import Prototype from 'prop-types'
import Link from 'next/link'
import { Input, Menu, Row, Col } from 'antd'
import 'antd/dist/antd.css'
import styled, { css } from 'styled-components'

import logo from '../img/logo.svg';
import changeLogo from '../img/logo_on.svg';

const GitLogoContainter = styled.div``;
const GitLogo = styled.a`
    background-image: url(${props => props.img});
    width: 32px;
    height: 32px;
    display: block;
    text-indent: -9999px;

    &:hover{
        background-image: url(${changeLogo});
    }
`

const AppLayout = ({ children }) => {
    return (
        <>
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href='/'><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href='/profile'><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
                </Menu.Item>
                <Menu.Item>
                    <Link href='/signup'><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    왼쪽 메뉴
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <div
                        className="tagContainer"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: 'center'
                        }}>
                        <a
                            style={{
                                marginBottom: '10px'
                            }}
                            href="https://blog.naver.com/qhanfckwsmsd"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Made by OSH
                        </a>

                        <GitLogoContainter className='gitLogoContainter'>
                            <GitLogo
                                // className='gitLogo'
                                img={logo}
                                href="https://github.com/oshosh"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                Github
                            </GitLogo>
                        </GitLogoContainter>
                    </div>

                </Col>
            </Row>

        </>
    );
}

export default AppLayout;

AppLayout.Prototype = {
    children: Prototype.node.isRequired,
}