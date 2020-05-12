import React, {useEffect, useState} from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [openReply, setOpenReply] = useState(false);
    const [commentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () => {
        setOpenReply(!openReply);
    }

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.videoId,
            responseTo: props.comment._id
        };

        axios.post('/api/comment/saveVideoComment', variables)
        .then(response => {
            if(response.data.success) {
                setCommentValue("");
                setOpenReply(false);
                props.refreshFunction(response.data.result);
            } else {
                alert('커멘트를 저장하지 못했습니다.');
            }
        });
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment.id}/>,
        !openReply ? 
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">답글</span> :
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">접기</span>
    ]

    return (
        <div>   
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                datetime={moment(props.comment.createdAt).format("YYYY. MM. DD")}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />
            {openReply && 
                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={commentValue}
                        placeholder="댓글을 작성해 주세요"
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={handleSubmit}>댓글</button>
                </form>
            }
        </div>
    )
}

export default SingleComment