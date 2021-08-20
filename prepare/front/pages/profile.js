import React, { useEffect } from 'react';
import Head from 'next/head'
import AppLayout from '../compontents/AppLayout';

import NicknameEditForm from '../compontents/NicknameEditForm';
import FollowList from '../compontents/FollowList';
import { useSelector } from 'react-redux';
import Router from 'next/router';

const Profile = () => {
    const { me } = useSelector((state) => state.user)
    // const followingList = [{ nickname: 'osh' }, { nickname: 'testuser' }, { nickname: 'testuser' }, { nickname: 'testuser' }]
    // const followerList = [{ nickname: 'osh' }, { nickname: 'testuser' }, { nickname: 'testuser' }, { nickname: 'testuser' }]
    useEffect(() => {
        if (!(me?.id)) {
            Router.push('/')
        }
    }, [me?.id]) // 첫 번째 렌더링 후에 호출되며 me.id가 호출 될때 마다
    if (!me) return null;
    return (
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList
                    header="팔로잉"
                    data={me.Followings}
                />
                <FollowList
                    header="팔로워"
                    data={me.Followers}
                />
            </AppLayout>

        </>

    );
}

export default Profile;