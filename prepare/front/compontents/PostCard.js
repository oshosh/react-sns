import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from '@ant-design/icons';
import { Button, Card, Popover, List, Comment } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux';
import Avatar from 'antd/lib/avatar/avatar';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';
import Link from 'next/link';
import moment from 'moment';


moment.locale('ko')
function PostCard({ post }) {
    const dispatch = useDispatch()
    const { removePostLoading } = useSelector((state) => state.post);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector(state => state.user.me?.id);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);
    const onLike = useCallback((e) => {
        if (!id) {
            return alert('로그인이 필요합니다.')
        }
        return dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        })
    }, [id])

    const onUnLike = useCallback((e) => {
        if (!id) {
            return alert('로그인이 필요합니다.')
        }
        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        })
    }, [commentFormOpened])

    const onRemovePost = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.')
        }
        return dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        })
    }, [])
    const onRetweet = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.')
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        })
    }, [id])

    const getdateFormated = (date) => {
        const otherDates = moment(date).fromNow();

        let callback = function (action) {

            if (action === 'lastDay') {
                return moment().startOf('day').fromNow()
            } else {
                return '[' + otherDates + ']';
            }
        }
        return moment(date).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'DD/MM/YYYY'
        });
    }

    const liked = post.Likers.find((v) => v.id === id)
    const YYYYMMDD = moment(post.createdAt).format('YYYYMMDD')
    const asdfasdf = getdateFormated(post.createdAt)

    return (
        <div style={{ marginBottom: '20px' }} >
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key='retweet' onClick={onRetweet} />,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnLike} />
                        : <HeartOutlined key="heart" onClick={onLike} />,
                    <MessageOutlined key='comment' onClick={onToggleComment} />,
                    <Popover key='more' content={(
                        <Button.Group>
                            {id && post.User.id === id
                                ? (
                                    <>
                                        <Button>수정</Button>
                                        <Button loading={removePostLoading} onClick={onRemovePost} type='danger'>삭제</Button>
                                    </>
                                )
                                : <Button>신고</Button>
                            }
                        </Button.Group>
                    )} >
                        <EllipsisOutlined />
                    </Popover>
                ]}
                title={post.RetweetId ? `${post.User.nickname} 님이 리트윗 하셨습니다.` : null}
                extra={id && <FollowButton post={post} />}
            >
                {post.RetweetId && post.Retweet
                    ? (
                        // 리트윗 게시물
                        <Card
                            cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
                        >
                            <div style={{ float: 'right' }}>{moment(YYYYMMDD, 'YYYYMMDD').fromNow()} {asdfasdf}</div>
                            <Card.Meta
                                style={{ clear: 'both' }}
                                avatar={(
                                    <Link href={`user/${post.Retweet.User.id}`}>
                                        <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                                    </Link>
                                )}
                                title={post.Retweet.User.nickname}
                                description={<PostCardContent postData={post.Retweet.content} />}
                            />
                        </Card>
                    )
                    : (
                        // 일반게시물
                        <>
                            <div style={{ float: 'right' }}>{moment(YYYYMMDD, "YYYYMMDD").fromNow()} {asdfasdf}</div>
                            <Card.Meta
                                style={{ clear: 'both' }}
                                avatar={(
                                    <Link href={`user/${post.User.id}`}>
                                        <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                                    </Link>
                                )}
                                title={post.User.nickname}
                                description={<PostCardContent postData={post.content} />}
                            />
                        </>
                    )}
            </Card>
            {commentFormOpened &&
                <div>
                    <CommentForm post={post} />
                    <List
                        header={`${post.Comments.length}개의 댓글`}
                        itemLayout='horizontal'
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={(
                                        <Link href={`user/${item.User.id}`}>
                                            <Avatar>{item.User.nickname[0]}</Avatar>
                                        </Link>
                                    )}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>
            }
        </div >
    );
}

PostCard.prototype = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object), // 객체 배열
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any),
    }).isRequired,
}

export default PostCard;