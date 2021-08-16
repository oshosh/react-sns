import { Button, Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useCallback } from 'react';
import styled from 'styled-components';

const UserInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const UserProfile = ({ setIsLoggedIn }) => {

    const onLogOut = useCallback(() => {
        setIsLoggedIn(false)
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

export default UserProfile;