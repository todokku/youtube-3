import React, {useState} from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import DropZone from 'react-dropzone';

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

function VideoUploadPage() {
    // 함수 기반 컴포넌트에서의 state 변수 관리!
    const [videoTitle, setVideoTitle] = useState("");
    const [description, setDescription] = useState("");
    const [access, setAccess] = useState(0);  // 기본 값은 0으로 설정! (private : 0, public : 1)
    const [category, setCategory] = useState("Film & Animation");

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

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>VideoUploadPage</Title>
            </div>

            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone */}
                    <DropZone
                    onDrop
                    multiple
                    maxSize
                    >
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                        alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                            <input {...getInputProps()}/>
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
                        </div>
                    )}  
                    </DropZone>
                    {/* Thumbnail */}
                    <div>
                        <img src alt />
                    </div>
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

                <Button type="primary" size="large" onClick>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
