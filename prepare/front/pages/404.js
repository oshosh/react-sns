import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
    width: 1080px;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    
    & h1 {
        color: red;
        font-size: 50px;
    }
`;

const SpanWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
    margin-bottom: 70px;

    & span{
        font-size: 30px;
        font-weight: 800;
    }
`

const GoToHomeBtn = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 170px;
    height: 50px;
    line-height: 20px;
    border: 5px solid #222;
    border-radius: 5px;
    background: #fff;
    
    & span {
        font-size: 20px;
        font-weight: 800;
        color: #222;
    }
`

function Custom404() {

    return (
        <Wrapper>
            <h1>404 - PAGE NOT FOUND</h1>
            <SpanWrapper>
                <span>찾을수 없는 페이지 입니다.</span>
                <span>{`요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다 :)`}</span>
            </SpanWrapper>

            <GoToHomeBtn>
                <Link href="/">
                    <a><span>홈으로 이동</span></a>
                </Link>
            </GoToHomeBtn>
        </Wrapper>
    )
}
export default Custom404;