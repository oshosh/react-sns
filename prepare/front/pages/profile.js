import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr'
import Head from 'next/head'
import AppLayout from '../compontents/AppLayout';

import NicknameEditForm from '../compontents/NicknameEditForm';
import FollowList from '../compontents/FollowList';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user'
import axios from 'axios';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import { backUrl } from '../config/config';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
    const { me } = useSelector((state) => state.user)
    const [followingsLimit, setFollowingsLimit] = useState(3);
    const [followersLimit, setFollowersLimit] = useState(3);

    const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher);
    const { data: followersData, error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher);

    useEffect(() => {
        if (!(me?.id)) {
            Router.push('/')
        }
    }, [me?.id]) // 첫 번째 렌더링 후에 호출되며 me.id가 호출 될때 마다

    const loadMoreFollowings = useCallback(() => {
        setFollowingsLimit((prev) => prev + 3)
    }, [])

    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit((prev) => prev + 3)
    }, [])

    if (followerError || followingError) {
        console.error(followerError || followingError);
        return '팔로잉/팔로워 로딩 중 에러가 발생했습니다.';
    }

    if (!me) {
        return '내 정보 로딩중...';
    }

    return (
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList
                    header="팔로잉"
                    data={followingsData}
                    loading={!followingsData && !followingError} // 아무것도 없을때 로딩중이다
                    onClickMore={loadMoreFollowings}
                />
                <FollowList
                    header="팔로워"
                    data={followersData}
                    loading={!followersData && !followerError}
                    onClickMore={loadMoreFollowers}
                />
            </AppLayout>

        </>

    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    console.log('getServerSideProps start');
    console.log(context.req.headers);
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch(END);
    console.log('getServerSideProps end');
    await context.store.sagaTask.toPromise();
});

export default Profile;