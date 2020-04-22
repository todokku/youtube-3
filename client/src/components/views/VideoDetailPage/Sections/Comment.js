import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const videoId = props.videoId;
    const user = useSelector(state => state.user);
    const [commentValue, setCommentValue] = useState("");

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('user.userData : ', user.userData);

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        };

        if(user.userData.isAuth) {
            axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    props.refreshFunction(response.data.result);
                    setCommentValue("");
                } else {
                    alert('커멘트를 저장하지 못했습니다.');
                }
            });
        } else {
            alert("로그인 하십시오!");
        }
    }

    return (
        <div>
            <br />
            <p>댓글</p>
            <hr />

            {/* Comment Lists */}
            {props.comments && props.comments.map((comment, index) => { 
                // 답글이 아닌 첫 댓글들만 뿌려준다.(responseTo가 없으므로!!)
                return (!comment.responseTo &&
                <React.Fragment> 
                    <SingleComment 
                        videoId={videoId}
                        comment={comment}
                        refreshFunction={props.refreshFunction}
                    />
                    <ReplyComment 
                        comments={props.comments}
                        parentCommentId={comment._id}
                        videoId={videoId}
                        refreshFunction={props.refreshFunction}
                    />
                </React.Fragment>
                );
            })}
            
            {/* Root Comment Form */}
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
        </div>
    )
}

export default Comment