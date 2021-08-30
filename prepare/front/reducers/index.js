import { HYDRATE } from 'next-redux-wrapper'
import { combineReducers } from 'redux'
import user from './user';
import post from './post';

// ssr 하기전..
// const rootReducer = combineReducers({
//     //ssr
//     index: (state = {}, action) => {
//         switch (action.type) {
//             case HYDRATE:
//                 console.log(HYDRATE, action)
//                 return { ...state, ...action.payload }

//             default:
//                 return state
//         }
//     },
//     user,
//     post
// })

const rootReducer = (state, action) => {
    switch (action.type) {
        case HYDRATE:
            // console.log('HYDRATE', action)
            return action.payload;
        default: {
            const combineReducer = combineReducers({
                user, post
            });
            return combineReducer(state, action)
        }
    }
}

// 위에꺼 원본
// const rootReducer = combineReducers({
//     user, post
// })

export default rootReducer;