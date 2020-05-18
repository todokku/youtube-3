import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

function LikeDislikes(props) {
    const user = useSelector(state => state.user);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [likeAction, setLikeAction] = useState(false);
    const [dislikeAction, setDislikeAction] = useState(false);

    let variable = {};

    // 비디오를 대상으로 한 좋아요/싫어요 컴포넌트일 때, video props를 전달한다.
    if(props.video) {
        variable = {
            videoId: props.videoId,
            userId: props.userId
        };
    } else {
        variable = {
            commentId: props.commentId,
            userId: props.userId
        }
    }

    useEffect(() => {
        console.log("variable : ", variable);
        // '좋아요'에 대한 정보를 가져온다.
        axios.post('/api/like/getLikes', variable)
        .then(response => {
            if(response.data.success) {
                // 얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length);

                // 내가 이미 그 좋아요를 눌렀는지
                response.data.likes.map( (like, idx) => {
                    // like 테이블의 여러 도큐먼트 중에 내 아이디가 있다면 내가 좋아요를 누른 것이다.
                    if(like.userId === props.userId) {
                        setLikeAction(true);
                    }
                })
            } else {
                alert('Likes 정보를 가져오지 못했습니다.');
            }
        });

        // '싫어요'에 대한 정보를 가져온다.
        axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if(response.data.success) {
                // 얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length);

                // 내가 이미 그 싫어요를 눌렀는지
                response.data.dislikes.map( (dislike, idx) => {
                    // dislike 테이블의 여러 도큐먼트 중에 내 아이디가 있다면 내가 좋아요를 누른 것이다.
                    if(dislike.userId === props.userId) {
                        setDislikeAction(true);
                    }
                })
            } else {
                alert('Dislikes 정보를 가져오지 못했습니다.');
            }
        });
    }, []);

    // '좋아요' 버튼을 클릭했을 때의 이벤트!
    const onLike = () => {
        // 로그인을 했다면
        if(user.userData.isAuth) {
            // '좋아요'를 누른 적이 없다면
            if(!likeAction) {
                // '좋아요'를 증가시킨다.(DB 반영)
                axios.post('/api/like/uplike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(likes+1);  // 좋아요 1 증가
                        setLikeAction(!likeAction); // 좋아요 클릭 반전

                        // '싫어요'가 클릭되어 있었다면
                        if(dislikeAction) {
                            // 좋아요를 하아라이트 하며 싫어요 클릭을 해제한다.
                            setDislikeAction(!dislikeAction);
                            setDislikes(dislikes-1);
                        }
                        
                    } else {
                        alert('Like를 올리지 못했습니다.');
                    }
                });
            } else {    // 이미 '좋아요'가 클릭되어 있다면!
                // '좋아요'를 감소시킨다.(DB 반영)
                axios.post('/api/like/unlike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(likes-1);  // 좋아요 1 감소
                        setLikeAction(!likeAction); // 좋아요 클릭 반전
                    } else {
                        alert('Like를 내리지 못했습니다.');
                    }
                });
            }
        } else {
            alert("로그인 하십시오!");
        }
    }

    // '싫어요' 버튼을 클릭했을 때의 이벤트!
    const onDisLike = () => {
        // 로그인을 했다면
        if(user.userData.isAuth) {
            // '싫어요'를 누른 적이 없다면
            if(!dislikeAction) {
                // '싫어요'를 증가시킨다.(DB 반영)
                axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(dislikes+1);  // 싫어요 1 증가
                        setDislikeAction(!dislikeAction); // 싫어요 클릭 반전

                        // '좋아요'가 클릭되어 있었다면
                        if(likeAction) {
                            // 싫어요 하아라이트 하며 좋아요 클릭을 해제한다.
                            setLikeAction(!likeAction);
                            setLikes(likes-1);
                        }
                        
                    } else {
                        alert('DisLike를 올리지 못했습니다.');
                    }
                });
            } else {    // 이미 '싫어요'가 클릭되어 있다면!
                // '싫어요'를 감소시킨다.(DB 반영)
                axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(dislikes-1);  // 싫어요 1 감소
                        setDislikeAction(!dislikeAction); // 싫어요 클릭 반전
                    } else {
                        alert('DisLike를 내리지 못했습니다.');
                    }
                });
            }
        } else {
            alert("로그인 하십시오!");
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon 
                        type="like"
                        theme={likeAction ? "filled" : "outlined"}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{likes}</span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon 
                        type="dislike"
                        theme={dislikeAction ? "filled" : "outlined"}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{dislikes}</span>
            </span>
        </div>
    );
}

export default LikeDislikes