import React from 'react';
import Head from 'next/head'
import AppLayout from '../compontents/AppLayout';

import NicknameEditForm from '../compontents/NicknameEditForm';
import FollowList from '../compontents/FollowList';

const Profile = () => {
    const followingList = [{ nickname: 'osh' }, { nickname: 'testuser' }, { nickname: 'testuser' }, { nickname: 'testuser' }]
    const followerList = [{ nickname: 'osh' }, { nickname: 'testuser' }, { nickname: 'testuser' }, { nickname: 'testuser' }]
    return (
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList header="팔로잉 목록" data={followingList} />
                <FollowList header="팔로워 목록" data={followerList} />
            </AppLayout>

        </>

    );
}

export default Profile;