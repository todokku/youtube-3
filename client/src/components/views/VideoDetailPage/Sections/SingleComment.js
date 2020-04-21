import React, {useEffect, useState} from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';

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

        alert('댓글의 댓글 기능은 아직 구현 못했으 ㅠㅠ');
        // const variables = {
        //     content: commentValue,
        //     writer: user.userData._id,
        //     postId: props.videoId
        // };

        // axios.post('/api/comment/saveComment', variables)
        // .then(response => {
        //     if(response.data.success) {
        //         console.log('comment data : ', response.data);
        //     } else {
        //         alert('커멘트를 저장하지 못했습니다.');
        //     }
        // });
    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">답글</span>
    ]

    return (
        <div>   
            <Comment
                actions={actions}
                author={props.comment.writer.name}
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
                    <button style={{ width: '20%', height: '52px' }} onClick={handleSubmit}>댓글 달기~</button>
                </form>
            }
        </div>
    )
}

export default SingleComment