import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../compontents/AppLayout';
import PostCard from '../compontents/PostCard';
import PostForm from '../compontents/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { InfiniteLoader, List } from 'react-virtualized';

const HOME = () => {
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({
            type: LOAD_POSTS_REQUEST
        })
    }, [])

    useEffect(() => {
        function onScroll() {
            // console.log(
            //     window.scrollY, // 스크롤 위치
            //     document.documentElement.clientHeight, // 화면의 높이
            //     document.documentElement.scrollHeight // 스크롤 길이
            // )
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePosts && !loadPostsLoading) {
                    dispatch({
                        type: LOAD_POSTS_REQUEST
                    })
                }
            }
        }

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [hasMorePosts])



    return (
        <AppLayout>
            {me && <PostForm />}
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

export default HOME;