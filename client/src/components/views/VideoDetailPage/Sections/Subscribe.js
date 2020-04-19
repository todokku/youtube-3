import React, {useEffect, useState} from 'react'
import axios from 'axios';

function Subscribe(props) {
    const [subscribeNumber, setSubscribeNumber] = useState(0);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        let variable = {
            userTo: props.userTo
        };

        // 비디오를 작성한 사람의 id를 가지고 있으면 구독자 수를 계산할 수 있다.
        axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response => {
            if(response.data.success) {
                setSubscribeNumber(response.data.subscribeNumber);
            } else {
                alert('구독자 수 정보를 받아오지 못했습니다.');
            }
        });

        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId')
        };

        // 그리고 여기로 들어온 user가 이 비디오를 게시한 user를 구독하는지도 파악해야 한다.
        axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
            if(response.data.success) {
                setSubscribed(response.data.subscribed);
            } else {
                alert('정보를 받아오지 못했습니다.');
            }
        });
    }, []);

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '10px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', cursor: 'pointer'
                }}
                onClick
            >
                {subscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    );
}

export default Subscribe