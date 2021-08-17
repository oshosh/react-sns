import React from 'react';
import { createWrapper } from 'next-redux-wrapper'
import { compose, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from '../reducers'

const configureStore = () => {

    // saga or thunk
    const middlewares = [];

    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(compose(applyMiddleware(...middlewares)))

    const store = createStore(reducer, enhancer)
    return store
}
const wrapper = createWrapper(configureStore, {
    debug: process.env.NODE_ENV === 'development',
})

export default wrapper;