import { useSelector } from "react-redux";
import AppLayout from "../compontents/AppLayout";
import PostCard from "../compontents/PostCard";
import PostForm from "../compontents/PostForm";

const HOME = () => {
    const { isLoggedIn } = useSelector((state) => state.user)
    const { mainPosts } = useSelector((state) => {
        return state.post
    })

    return (
        <AppLayout>
            {isLoggedIn && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}

        </AppLayout>
    );
}

export default HOME;