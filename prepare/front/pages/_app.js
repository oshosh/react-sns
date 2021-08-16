import 'antd/dist/antd.css'
import Prototype from 'prop-types'
import Head from 'next/head'

const App = ({ Component }) => {

    return (
        <>
            <Head>
                <meta charSet='utf-8'></meta>
                <title>NodeBird</title>
            </Head>
            {/* <div>공통메뉴</div> */}
            <Component />
        </>

    );
}

export default App;

App.Prototype = {
    Component: Prototype.elementType.isRequired,
}