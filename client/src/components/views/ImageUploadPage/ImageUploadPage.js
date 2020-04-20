import React, {useState} from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import DropZone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

import * as constants from '../../Config';

const { TextArea } = Input;
const { Title } = Typography;

function ImageUploadPage(props) {
    const user = useSelector(state => state.user);  // 로그인된 user 정보(redux가 state에 관리)를 user 변수에 담는다.
    const [imageTitle, setImageTitle] = useState(undefined);
    const [description, setDescription] = useState(undefined);
    const [filePath, setFilePath] = useState(undefined);

    /* 이벤트 함수들 정의! */
    const onTitleChange = (e) => {
        setImageTitle(e.currentTarget.value);
    };

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    };

    const onFileChange = (e) => { 
        let files = e.currentTarget.files;
        let formData = new FormData;
        
        formData.append('file', files[0]);

        const config = {
            header: {'content-type': 'multipart/form-data'}
        };

        axios.post('/api/image/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success) {
                console.log(response.data);
                setFilePath(response.data.url);
            } else {
                alert('이미지 업로드를 실패했습니다.');
                setFilePath(undefined);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    const onSubmit = (e) => {
        // 기존 이벤트 방지하고 아래에 우리가 정의한 하고 싶은 이벤트가 실행된다.
        e.preventDefault();

        // 모든 항목이 기재된 경우에만 DB에 저장한다.
        if(filePath && imageTitle && description) {
            const variables = {
                writer: user.userData._id,
                title: imageTitle,
                description: description,
                filePath: filePath
            };

            axios.post('/api/image/uploadImage', variables)
            .then(response => {
                if(response.data.success) {
                    message.success("성공적으로 업로드를 했습니다.");
    
                    // 업로드 성공했으므로 1.5초 후 홈으로 리다이렉트
                    setTimeout( () => {
                        props.history.push('/');
                    }, 1500);
                } else {
                    alert('사진 업로드에 실패 했습니다');
                }
            })
        } else {
            alert('모든 항목을 채우십시오!');
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Image Upload Page</Title> 
            </div>

            <Form onSubmit={onSubmit}>
                <div>
                    {/* File upload zone */}
                    <input
                        type='file'
                        onChange={onFileChange}
                        required
                    />   
                    {/* Thumbnail */}
                    {/* 썸네일 자원 경로가 있을 때에만 이미지 띄우기! 그렇지 않으면 엑박이 뜬다. */}
                    {filePath && 
                        <div>
                            <img 
                                src={`${constants.URL_BACK}/${filePath}`} // 현재 클라이언트와 다른 주소로 서버가 사용되므로 앞에 도메인 명시!
                                alt="image" 
                                style={{ width: '300px', height: '300px' }}
                            />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={imageTitle}
                    required
                />

                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={description}
                    required
                />

                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default ImageUploadPage