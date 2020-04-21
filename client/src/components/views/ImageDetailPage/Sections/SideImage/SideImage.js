import React, {useEffect, useState} from 'react'
import axios from 'axios';

import * as constants from '../../../../Config';

function SideImage() {
    const [sideImages, setSideImages] = useState([]);

    useEffect(() => {
        axios.get('/api/image/getImages')
        .then(response => {
            if(response.data.success) {
                setSideImages(response.data.images);
            } else {
                alert('이미지 가져오기를 실패 했습니다.');
            }
        });
    }, []);

    const renderSideImage = sideImages.map((image, idx) => {
        if(image.writer) {
            return (
                <div key={idx} style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}>
                    {/* 왼쪽 부분 */}
                    <div style={{ width: '40%', marginRight: '1rem' }}>
                        <a href={`/images/${image._id}`}>
                            <img 
                                style={{ width: '100%', height: '100%' }}
                                src={`${constants.URL_BACK}/${image.filePath}`}
                                alt="thumbnail"
                            />
                        </a>
                    </div>
                    {/* 오른쪽 부분 */}
                    <div style={{ width: '50%' }}>
                        <a href={`/images/${image._id}`} style={{ color: 'gray' }}>
                            <span style={{ fontSize: '1rem', color: 'black' }}> {image.title} </span><br />
                            <span>{image.writer.name}</span><br />
                            <span>조회수 {image.views}회</span><br />
                        </a>
                    </div>
                </div>
            );
        } else {
            return (
                <div>...loading</div>
            );
        }
    });

    return (
        <React.Fragment>
            <div style={{ marginTop: '3rem' }}>
                {renderSideImage}
            </div>
        </React.Fragment>
    );
}

export default SideImage