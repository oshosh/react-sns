import { Button, Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {

    const dispatch = useDispatch()
    const { me, logOutLoading } = useSelector(state => state.user)
    const onLogOut = useCallback(() => {
        dispatch(logoutRequestAction())
    }, [])
    return (
        <Card
            actions={[
                <div div key='twit'>
                    <Link href={`/user/${me.id}`}>
                        <a>짹짹 < br />{me.Posts.length}</a>
                    </Link>
                </div >,
                <div key='followings'>
                    <Link href={`/profile`}>
                        <a>팔로잉<br />{me.Followings.length}</a>
                    </Link>
                </div>,
                <div key='followings'>
                    <Link href={`/profile`}>
                        <a>팔로워<br />{me.Followers.length}</a>
                    </Link>
                </div>,
            ]}
        >
            <Card.Meta
                avatar={(
                    <Link href={`/user/${me.id}`}>
                        <a><Avatar>{me?.nickname[0]}</Avatar></a>
                    </Link>
                )}
                title={me.nickname}
            />
            <Button
                onClick={onLogOut}
                loading={logOutLoading}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 10
                }}
            >
                로그아웃
            </Button>
        </Card>
    );
}
UserProfile.propTypes = {
    setIsLoggedIn: PropTypes.func.isRequired,
}

export default UserProfile;


