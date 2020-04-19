import React, {useEffect, useState} from 'react'
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';

import * as constants from '../../Config';

function VideoDetailPage(props) {    
    const videoId = props.match.params.videoId;     // 현재 창의 url로부터 :videoId 추출!
    const variable = {
        videoId: videoId
    };

    const [videoDetail, setVideoDetail] = useState({});

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                console.log('response.data.videoDetail : ', response.data.videoDetail);
                setVideoDetail(response.data.videoDetail);
            } else {
                alert('비디오 가져오기를 실패 했습니다.');
            }
        })
    }, []);

    if(videoDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video 
                            style={{ width: '100%' }} 
                            src={`${constants.URL_BACK}/${videoDetail.filePath}`}
                            type="video/mp4"
                            autoPlay
                        />
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={videoDetail.writer.image} />}
                                title={videoDetail.writer.name}
                                description={videoDetail.description}
                            />
                        </List.Item>
    
                        {/* Comments */}
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