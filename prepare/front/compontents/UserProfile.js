import { Button, Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../reducers/user';

const UserInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const UserProfile = () => {

    const dispatch = useDispatch()
    const onLogOut = useCallback(() => {
        dispatch(logoutAction())
    }, [])

    return (
        <Card
            actions={[
                <div div key='twit' > 짹짹 < br /> 0</div >,
                <div key='followings'>팔로잉<br />0</div>,
                <div key='followings'>팔로워<br />0</div>,
            ]}
        >
            <UserInfoContainer>
                <Card.Meta
                    avatar={<Avatar>OH</Avatar>}
                    title="OSH"
                />
                <Button
                    onClick={onLogOut}
                >
                    로그아웃
                </Button>
            </UserInfoContainer>

        </Card>
    );
}
UserProfile.propTypes = {
    setIsLoggedIn: PropTypes.func.isRequired,
}

export default UserProfile;


