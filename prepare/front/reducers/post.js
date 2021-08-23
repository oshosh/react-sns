import shortId from 'shortid'
import { produce } from 'immer'
import shortid from 'shortid';
import faker from 'faker'

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
                id: shortId.generate(),
                src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
            },
            {
                id: shortId.generate(),
                src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
            },
            {
                id: shortId.generate(),
                src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
            }
        ],
        Comments: [{
            id: shortId.generate(),
            User: {
                id: shortId.generate(),
                nickname: 'nero',
            },
            content: '우와 개정판이 나왔군요~',
        }, {
            User: {
                id: shortId.generate(),
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

    removePostLoading: false,
    removePostDone: false,
    removePostError: null,

    // 인피니티 스크롤링
    hasMorePosts: true,
    loadPostsLoading: false,
    loadPostsDone: false,
    loadPostsError: null,
}
const randomArr = [1, 2, 3, 4, 5, 6,]

export const generaterDummyPost = (number) => Array(number).fill().map(() => ({
    id: shortid.generate(),
    User: {
        id: shortid.generate(),
        nickname: faker.name.findName()
    },
    content: faker.lorem.paragraph(),
    Images: Array(
        Math.floor(Math.random() * randomArr.length) === 0
            ? 1
            : Math.floor(Math.random() * randomArr.length)
    ).fill().map(() => ({
        id: shortid.generate(),
        src: faker.image.image(),
    })),
    Comments: [{
        User: {
            id: shortid.generate(),
            nickname: faker.name.findName()
        },
        content: faker.lorem.sentence(),
    }],
}))

// initialState.mainPosts = initialState.mainPosts.concat(generaterDummyPost(10));


export const addPost = (data) => {
    return {
        type: ADD_POST_REQUEST,
        data
    }
}

export const addComment = (data) => ({
    type: ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = (data) => ({
    // npm i shortid
    // npm i faker
    id: data.id,
    content: data.content,
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

// 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성을 지키면서...)
export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case ADD_POST_REQUEST:
                draft.addPostLoading = true
                draft.addPostDone = false
                draft.addPostError = null
                break;
            case ADD_POST_SUCCESS:
                // draft.mainPosts.unshift(dummyPost(action.data))
                draft.mainPosts.unshift(action.data)
                draft.addPostLoading = false
                draft.addPostDone = true
                break;
            case ADD_POST_FAILURE:
                draft.PostLoading = false
                draft.PostError = action.error
                break;
            case ADD_COMMENT_REQUEST:
                draft.addCommentLoading = true
                draft.addCommentDone = false
                draft.addCommentError = null
                break;
            case ADD_COMMENT_SUCCESS:
                const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
                // post.Comments.unshift(dummyComment(action.data.content));
                post.Comments.unshift(action.data);
                draft.addCommentLoading = false;
                draft.addCommentDone = true;
                break;
            // const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId)

            // const post = { ...state.mainPosts[postIndex] }
            // post.Comments = [dummyComment(action.data.content), ...post.Comments]

            // const mainPosts = [...state.mainPosts]
            // mainPosts[postIndex] = post

            // return {
            //     ...state,
            //     mainPosts,
            //     addCommentLoading: false,
            //     addCommentDone: true,
            // }
            case ADD_COMMENT_FAILURE:
                draft.addPostLoading = false;
                draft.addPostError = action.error;
                break;



            case REMOVE_POST_REQUEST:
                draft.removePostLoading = true;
                draft.removePostDone = false;
                draft.removePostError = null;
                break;
            case REMOVE_POST_SUCCESS:
                draft.removePostLoading = false;
                draft.removePostDone = true;
                draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
                break;
            case REMOVE_POST_FAILURE:
                draft.removePostLoading = false;
                draft.removePostError = action.error;
                break;

            case LOAD_POSTS_REQUEST:
                draft.loadPostsLoading = true;
                draft.loadPostsDone = false;
                draft.loadPostsError = null;
                break;
            case LOAD_POSTS_SUCCESS:
                draft.loadPostsLoading = false;
                draft.loadPostsDone = true;
                draft.mainPosts = action.data.concat(draft.mainPosts) //draft.mainPosts.concat(action.data);
                draft.hasMorePosts = draft.mainPosts.length < 50; //action.data.length === 10;
                break;
            case LOAD_POSTS_FAILURE:
                draft.loadPostsLoading = false;
                draft.loadPostsError = action.error;
                break;
            default:
                break


        }
    });
}
const asd = {
    User: {
        nickname: 'osssh'
    },
    content: 'testuser입니다'
}