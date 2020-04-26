import React, {useEffect, useState} from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [childCommentNumber, setChildCommentNumber] = useState(0);
    const [openReplyComments, setOpenReplyComments] = useState(false);

    // 두 번째 배열이 빈 배열이면 딱 한 번 로드될때만 실행된다.
    // 상태가 바뀌면 바로바로 적용되도록 하자! => props.comments가 부모로부터 올 때 변경이 일어나면 다시 실행!
    useEffect(() => {
        let commentNumber = 0;

        props.comments.map((comment, index) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        });

        setChildCommentNumber(commentNumber);
    }, [props.comments]);

    const renderReplyComment = (parentCommentId) => {
        return props.comments.map((comment, index) => {
            // 바로 부모의 commentId와 자식의 responseTo 아이디가 같아야 한다는 조건이 붙는다.
            // ReplyComment를 재귀적으로 돌린다. 그러면 각각이 부모 commentId에 꼬리물기 식으로 붙는다.
            if(comment.responseTo === parentCommentId) {  
                return (
                    <React.Fragment> 
                        <div style={{ width: '80%', marginLeft: '40px' }}>
                            <SingleComment 
                                imageId={props.imageId}
                                comment={comment}
                                refreshFunction={props.refreshFunction}
                            />
                            <ReplyComment 
                                comments={props.comments}
                                parentCommentId={comment._id}
                                imageId={props.imageId}
                                refreshFunction={props.refreshFunction}
                            />
                        </div>
                    </React.Fragment>
                );
            }
        });
    }

    const handleClick = () => {
        setOpenReplyComments(!openReplyComments);
    }

    return (
        <div>
            {childCommentNumber > 0 && 
                (!openReplyComments ? 
                <p style={{ fontSize: '14px', margin: 0, color: 'gray', cursor: 'pointer' }} onClick={handleClick}>
                    답글 {childCommentNumber}개 더보기
                </p> : 
                <p style={{ fontSize: '14px', margin: 0, color: 'gray', cursor: 'pointer' }} onClick={handleClick}>
                    접기
                </p>)
            }

            {
                openReplyComments && renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment