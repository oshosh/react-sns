//초기값
export const initialState = {
    isLoggedIn: false,
    me: null,
    signUpData: {},
    loginData: {},
}


// 액션 함수
export const loginAction = (data) => {
    return {
        type: 'LOG_IN',
        data
    }
}

export const logoutAction = (data) => {
    return {
        type: 'LOG_OUT',
        data
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                isLoggedIn: true,
                me: action.data,
            }
        case 'LOG_OUT':
            return {
                ...state,
                isLoggedIn: false,
                me: null
            }
        default:
            return state;
    }
}