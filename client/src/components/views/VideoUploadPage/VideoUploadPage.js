import React, {useState} from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import DropZone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

/*
    select 태그의 option은 여러 개이므로 이를 하드 코딩하기 보다는
    map 함수를 통해서 그리기 위해 미리 배열로 정의하는 것이다.
*/
const accessOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"},
];

const categoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"}
];

function VideoUploadPage(props) {
    /* 함수 기반 컴포넌트에서의 state 변수 관리! */
    const user = useSelector(state => state.user);  // 로그인된 user 정보(redux가 state에 관리)를 user 변수에 담는다.
    const [videoTitle, setVideoTitle] = useState("");
    const [description, setDescription] = useState("");
    const [access, setAccess] = useState(0);  // 기본 값은 0으로 설정! (private : 0, public : 1)
    const [category, setCategory] = useState("Film & Animation");
    const [filePath, setFilePath] = useState(undefined);
    const [duration, setDuration] = useState("");
    const [thumbnailPath, setThumbnailPath] = useState("");

    /* 이벤트 함수들 정의! */
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    };

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    };

    const onAccessChange = (e) => {
        setAccess(e.currentTarget.value);
    };

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    };

    const onFileChange = (e) => {
        let formData = new FormData;
        let files = e.currentTarget.files;

        console.log('file : ', files[0]);

        formData.append('file', files[0]);
        
        const config = {
            header: {'content-type': 'multipart/form-data'}
        };

        axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success) {
                console.log(response.data);

                let variable = {
                    url: response.data.url,
                    fileName: response.data.fileName
                };

                setFilePath(response.data.url);

                // 썸네일 요청!
                axios.post('/api/video/thumbnail', variable)
                .then(response => {
                    if(response.data.success) {
                        setDuration(response.data.fileDuration);
                        setThumbnailPath(response.data.url);
                    } else {
                        alert('썸네일 생성에 실패 했습니다.');
                    }
                });
            } else {
                alert('비디오 업로드를 실패했습니다. mp4 확장자만 지원합니다 !!');
                setFilePath(undefined);
            }
        })
        .catch(error => {
            console.log(error)
        });
    };

    const onSubmit = (e) => {
        // 기존 이벤트 방지하고 아래에 우리가 정의한 하고 싶은 이벤트가 실행된다.
        e.preventDefault();

        if(filePath) {
            const variables = {
                writer: user.userData._id,
                title: videoTitle,
                description: description,
                privacy: access,
                filePath: filePath,
                category: category,
                duration: duration,
                thumbnail: thumbnailPath
            };
    
            axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success) {
                    message.success("성공적으로 업로드를 했습니다.");
    
                    // 업로드 성공했으므로 3초 후 홈으로 리다이렉트
                    setTimeout( () => {
                        props.history.push('/');
                    }, 3000);
                } else {
                    alert('비디오 업로드에 실패 했습니다');
                }
            });
        } else {
            alert('파일을 선택해 주십시오!');
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>VideoUploadPage</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* File upload zone */}
                    <input
                        type='file'
                        style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                        alignItems: 'center', justifyContent: 'center' }}
                        onChange={onFileChange}
                    />   
                    {/* Thumbnail */}
                    {/* 썸네일 자원 경로가 있을 때에만 이미지 띄우기! 그렇지 않으면 엑박이 뜬다. */}
                    {thumbnailPath && 
                        <div>
                            <img 
                                src={`http://localhost:5000/${thumbnailPath}`} // 현재 클라이언트와 다른 주소로 서버가 사용되므로 앞에 도메인 명시!
                                alt="thumbnail" 
                            />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={videoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={description}
                />
                <br />
                <br />

                <select onChange={onAccessChange}>
                    {/* html과 어울러 script(변수 + 함수)를 쓰기 위해서는 {}로 묶어준다. */}
                    {accessOptions.map( (item, index) => {
                        return <option key={index} value={item.value}>{item.label}</option>    // key에 값을 넣어줘야 에러 메시지가 안 뜬다.
                    })}
                </select>
                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {categoryOptions.map( (item, index) => {
                        return <option key={index} value={item.value}>{item.label}</option>
                    })}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
