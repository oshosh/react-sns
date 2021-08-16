import React from 'react';
import Prototype from 'prop-types'
import Link from 'next/link'

const AppLayout = ({ children }) => {
    return (
        <>
            <div>
                <Link href='/'><a>노드버드</a></Link>
                <Link href='/profile'><a>프로필</a></Link>
                <Link href='/signup'><a>회원가입</a></Link>
            </div>
            {children}
        </>
    );
}

export default AppLayout;

AppLayout.Prototype = {
    children: Prototype.node.isRequired,
}