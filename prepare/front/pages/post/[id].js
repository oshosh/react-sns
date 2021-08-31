// 다이나믹 라우팅
// post/[id].js

import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import AppLayout from "../../compontents/AppLayout";
import PostCard from "../../compontents/PostCard";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const { singlePost } = useSelector((state) => state.post)

    // if(router.isFallback){
    //     return <div>로딩중....</div>
    // }
    return (
        <AppLayout>
            <Head>
                <title>
                    {singlePost.User.nickname}
                </title>
                <meta name="description" content={singlePost.content} />
                <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
                <meta property="og:description" content={singlePost.content} />
                <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
                <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
            </Head>
            <PostCard post={singlePost} />
        </AppLayout>
    );
};

// export async function getStaticPaths() {
//     // const result = await axios.get('/post/list')
//     return {
//         paths: [
//             { params: { id: '15' } },
//             { params: { id: '44' } },
//             { params: { id: '45' } },
//         ],
//         fallback: true,
//     };
// }

// export const getStaticProps = wrapper.getStaticProps(async (context) => {
//     const cookie = context.req ? context.req.headers.cookie : '';
//     axios.defaults.headers.Cookie = '';

//     if (context.req && cookie) {
//         axios.defaults.headers.Cookie = cookie;
//     }

//     context.store.dispatch({
//         type: LOAD_MY_INFO_REQUEST
//     });

//     context.store.dispatch({
//         type: LOAD_POST_REQUEST,
//         data: context.params.id,
//     })

//     context.store.dispatch(END)
//     await context.store.sagaTask.toPromise();
// });

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST
    });

    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.params.id,
    })

    context.store.dispatch(END)
    await context.store.sagaTask.toPromise();
});


export default Post;