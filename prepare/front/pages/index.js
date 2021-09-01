import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AppLayout from '../compontents/AppLayout';
import PostCard from '../compontents/PostCard';
import PostForm from '../compontents/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const HOME = () => {
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post)

    useEffect(() => {
        if (retweetError) {
            alert(retweetError);
        }
    }, [retweetError])

    //SSR로 인한 사용 안함
    // useEffect(() => {
    //     dispatch({
    //         type: LOAD_MY_INFO_REQUEST
    //     })
    //     dispatch({
    //         type: LOAD_POSTS_REQUEST
    //     })
    // }, [])

    useEffect(() => {
        function onScroll() {
            // console.log(
            //     window.scrollY, // 스크롤 위치
            //     document.documentElement.clientHeight, // 화면의 높이
            //     document.documentElement.scrollHeight // 스크롤 길이
            // )
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePosts && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId,
                    })
                }
            }
        }

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [hasMorePosts, loadPostsLoading, mainPosts])



    return (
        <AppLayout>
            {/* 게시글 작성 */}
            {me && <PostForm />}

            {/* 게시글 목록 */}
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
            {/* <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={remoteRowCount}
            >
                {({ onRowsRendered, registerChild }) => (
                    <List
                        height={200}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={remoteRowCount}
                        rowHeight={20}
                        rowRenderer={rowRenderer}
                        width={300}
                    />
                )}
            </InfiniteLoader> */}
        </AppLayout>
    );
}

// ssr
// 순전히 front 서버에서 가져오는 정보
// front에서 back으로 가져와 success을 시키기때문에 credential, access allow control 문제 생김 (쿠키)
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    // 쿠키를 지웠다가 넣어줘야한다.
    // 서버쿠키정보를 계속 들고오는 경우가 있어 다른사람이 타 유저 아이디로 접속되는 현상이 있다.
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST
    });
    context.store.dispatch({
        type: LOAD_POSTS_REQUEST
    });
    context.store.dispatch(END)
    await context.store.sagaTask.toPromise();
});


export default HOME;