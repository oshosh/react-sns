import { useSelector } from 'react-redux';
import AppLayout from '../compontents/AppLayout';
import PostCard from '../compontents/PostCard';
import PostForm from '../compontents/PostForm';

const HOME = () => {
    const { me } = useSelector((state) => state.user);
    const { mainPosts } = useSelector((state) => state.post)

    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}

        </AppLayout>
    );
}

export default HOME;