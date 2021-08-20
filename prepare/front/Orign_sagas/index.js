import { all, fork } from "@redux-saga/core/effects";
// fork - 비동기로 함수 실행 (non-block)
// all - 배열 내 action 전부 실행
// take - action이 실행 될 떄 까지 대기

// call - 동기적로 함수 호출 (block)
// put - action에 대한 dispatch 작업 (action function 이라 보면 됨)

import postSaga from "./post";
import userSaga from "./user";

export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ])
}