import React from 'react';
import Head from 'next/head'
import AppLayout from '../compontents/AppLayout';

import NicknameEditForm from '../compontents/NicknameEditForm';
import FollowList from '../compontents/FollowList';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { me } = useSelector((state) => state.user)
    // const followingList = [{ nickname: 'osh' }, { nickname: 'testuser' }, { nickname: 'testuser' }, { nickname: 'testuser' }]
    // const followerList = [{ nickname: 'osh' }, { nickname: 'testuser' }, { nickname: 'testuser' }, { nickname: 'testuser' }]
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