import React from 'react';
import Prototype from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

import wrapper from '../store/configureStore';

const App = ({ Component, pageProps }) => {
    debugger
    return (
        <>
            <Head>
                <meta charSet='utf-8'></meta>
                <title>NodeBird</title>
            </Head>
            <Component {...pageProps} />
        </>

    );
}

App.Prototype = {
    Component: Prototype.elementType.isRequired,
}

export default wrapper.withRedux(App);
