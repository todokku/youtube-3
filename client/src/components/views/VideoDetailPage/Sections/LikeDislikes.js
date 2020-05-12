import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import axios from 'axios';

function LikeDislikes(props) {

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

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon 
                        type="like"
                        theme={likeAction ? "filled" : "outlined"}
                        onClick
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{likes}</span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon 
                        type="dislike"
                        theme={dislikeAction ? "filled" : "outlined"}
                        onClick
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{dislikes}</span>
            </span>
        </div>
    );
}

export default LikeDislikes