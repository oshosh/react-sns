import shortId from 'shortid'

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const initialState = {
    // db 시퀄라이즈는 대문자로
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: 'osh',
        },
        content: '첫 번째 게시글 #해시태그 #익스프레스',
        Images: [
            {
                src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
            },
            {
                src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
            },
            {
                src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
            }
        ],
        Comments: [{
            User: {
                nickname: 'nero',
            },
            content: '우와 개정판이 나왔군요~',
        }, {
            User: {
                nickname: 'hero',
            },
            content: '얼른 사고싶어요~',
        }]
    }],
    imagePaths: [],

    addPostLoading: false,
    addPostDone: false,
    addPostError: null,

    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
}

export const addPost = (data) => ({
    type: ADD_POST_REQUEST,
    data
})

export const addComment = (data) => ({
    type: ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = (data) => ({
    // npm i shortid
    // npm i faker
    id: shortId.generate(),
    content: data,
    User: {
        id: 1,
        nickname: 'osh',
    },
    Images: [],
    Comments: [],
})

const dummyComment = (data) => ({
    id: shortId.generate(),
    content: data,
    User: {
        id: 1,
        nickname: 'osh',
    },
})

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST_REQUEST:
            return {
                ...state,
                addPostLoading: true,
                addPostDone: false,
                addPostError: null,
            }
        case ADD_POST_SUCCESS:
            return {
                ...state,
                mainPosts: [dummyPost(action.data), ...state.mainPosts],
                addPostLoading: false,
                addPostDone: true,
            }
        case ADD_POST_FAILURE:
            return {
                ...state,
                addPostLoading: false,
                addPostError: action.error,
            }

        case ADD_COMMENT_REQUEST:
            return {
                ...state,
                addCommentLoading: true,
                addCommentDone: false,
                addCommentError: null,
            }
        case ADD_COMMENT_SUCCESS:
            const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId)

            const post = { ...state.mainPosts[postIndex] }
            post.Comments = [dummyComment(action.data.content), ...post.Comments]

            const mainPosts = [...state.mainPosts]
            mainPosts[postIndex] = post

            return {
                ...state,
                mainPosts,
                addCommentLoading: false,
                addCommentDone: true,
            }
        case ADD_COMMENT_FAILURE:
            return {
                ...state,
                addCommentLoading: false,
                addCommentError: action.error,
            }
        default:
            return state;
    }
}
const asd = {
    User: {
        nickname: 'osssh'
    },
    content: 'testuser입니다'
}