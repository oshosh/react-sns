import { Button, Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {

    const dispatch = useDispatch()
    const { me, logOutLoading } = useSelector(state => state.user)
    const onLogOut = useCallback(() => {
        dispatch(logoutRequestAction())
    }, [])
    return (
        <Card
            actions={[
                <div div key='twit' > 짹짹 < br />{me.Posts.length}</div >,
                <div key='followings'>팔로잉<br />{me.Followings.length}</div>,
                <div key='followings'>팔로워<br />{me.Followers.length}</div>,
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{me?.nickname[0]}</Avatar>}
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


