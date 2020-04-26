import React, {useEffect, useState} from 'react'
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

import * as constants from '../../Config';

function VideoDetailPage(props) {    
    const videoId = props.match.params.videoId;     // 현재 창의 url로부터 :videoId 추출!
    const variable = {
        videoId: videoId
    };

    const [videoDetail, setVideoDetail] = useState({});
    const [comments, setComments] = useState([]);

    useEffect(() => {
        
        axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.videoDetail);
            } else {
                alert('비디오 가져오기를 실패 했습니다.');
            }
        });

        axios.post('/api/comment/getVideoComments', variable)
        .then(response => {
            if(response.data.success) {
                setComments(response.data.comments);
            } else {
                alert('코멘트 정보 가져오기를 실패 했습니다.');
            }
        });

    }, []);

    const refreshFunction = (newComment) => {
        setComments(comments.concat(newComment));
    }

    // 데이터베이스에서 불러오는게 화면이 렌더링 하는 것보다 늦어질 수 있으므로!
    if(videoDetail.writer) {
        const subscribeButton = videoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={videoDetail.writer._id} />;

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video 
                            style={{ width: '100%' }} 
                            src={`${constants.URL_BACK}/${videoDetail.filePath}`}
                            type="video/mp4"
                            autoPlay
                            controls
                        />
                        <List.Item
                            actions={[ subscribeButton ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={videoDetail.writer.image} />}
                                title={videoDetail.writer.name}
                                description={videoDetail.description}
                            />
                        </List.Item>
    
                        {/* Comments */}
                        <Comment 
                            videoId={videoId}
                            comments={comments}
                            refreshFunction={refreshFunction}
                        />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        );
    } else {
        return (
            <div>...loading</div>
        );
    }
}

export default VideoDetailPage