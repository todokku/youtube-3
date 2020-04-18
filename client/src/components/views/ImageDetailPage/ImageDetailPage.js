import React, {useEffect, useState} from 'react'
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';

import * as constants from '../../Config';

function ImageDetailPage(props) {
    const imageId = props.match.params.imageId;     // 현재 창의 url로부터 :videoId 추출!
    const variable = {
        imageId: imageId
    };

    const [imageDetail, setImageDetail] = useState({});

    useEffect(() => {
        axios.post('/api/image/getImageDetail', variable)
        .then(response => {
            if(response.data.success) {
                console.log('response.data.imageDetail : ', response.data.imageDetail);
                setImageDetail(response.data.imageDetail);
            } else {
                alert('이미지 불러오기를 실패 했습니다.');
            }
        })
    }, []);

    if(imageDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <img 
                            style={{ width: '100%' }} 
                            src={`${constants.URL_BACK}/${imageDetail.filePath}`}
                            alt="image"
                        />
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={imageDetail.writer.image} />}
                                title={imageDetail.writer.name}
                                description={imageDetail.description}
                            />
                        </List.Item>
    
                        {/* Comments */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    Side Images
                </Col>
            </Row>
        );
    } else {
        return (
            <div>...loading</div>
        );
    }
}

export default ImageDetailPage