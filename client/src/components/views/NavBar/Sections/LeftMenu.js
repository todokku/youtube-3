import React from 'react';
import { Menu } from 'antd';
import { useSelector } from "react-redux";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  const user = useSelector(state => state.user)

  // 로그인 안 한 사람들
  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/">홈 (모든 비디오)</a>
      </Menu.Item>
      <Menu.Item key="images">
        <a href="/images">사진첩</a>
      </Menu.Item>
    </Menu>
    );
  } else {  // 로그인 한 사람들
    return (
      <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/">홈 (모든 비디오)</a>
      </Menu.Item>
      <Menu.Item key="subscription">
        <a href="/subscription">내 구독 비디오 페이지</a>
      </Menu.Item>
      <Menu.Item key="images">
        <a href="/images">사진첩</a>
      </Menu.Item>
    </Menu>
    );
  }
}

export default LeftMenu