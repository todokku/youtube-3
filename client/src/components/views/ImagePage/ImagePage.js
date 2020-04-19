import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import { Row, Col, Card, Icon, Avatar, Typography } from 'antd';
import axios from 'axios';
import moment from 'moment';

import * as constants from '../../Config';

const {Title} = Typography;
const {Meta} = Card;

function ImagePage() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios.get('/api/image/getImages')
        .then(response => {
            if(response.data.success) {
                setImages(response.data.images);
            } else {
                alert('이미지 가져오기를 실패 했습니다.');
            }
        })
        .catch(error => {
            console.log("error : ", error);
        })
    }, []);

    const renderCards = images.map((image, idx) => {
        if(image.writer) {
            // Col : xs 24사이즈가 전체 윈도우 사이즈이다. lg는 가장 큰 사이즈이므로 화면이 가득 차면 4개가 들어간다.
            return <Col key={idx} lg={6} md={8} xs={24}>
                <div style={{ position: 'relative' }}>
                    <a href={`/images/${image._id}`}>
                        <img 
                            style={{
                                width: '100%'
                            }}
                            src={`${constants.URL_BACK}/${image.filePath}`}
                            alt='image'
                        />
                    </a>
                </div>
                <br/>
                <Meta
                    avatar={
                        <Avatar src={image.writer.image}/>
                    }
                    title={image.title}
                    description=""
                />
                <span>{image.writer.name}</span><br/>
                <span style={{marginLeft: '3rem'}}>{moment(image.createdAt).format("MMM Do YY")}</span>
            </Col>
        } else {
            return (
                <div>...loading</div>
            );
        }
    });

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}> kyomin's 이미지 저장소 </Title>
            <hr/>
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    );
}

export default ImagePage
