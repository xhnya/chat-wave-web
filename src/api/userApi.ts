import axiosInstance from './axiosInstance';

// 登录接口
export function loginApi(data: any) {
    return axiosInstance.request({
        url: '/users/login',
        method: 'post',
        data: data
    })
}

export function getUserInfoApi() {
    return axiosInstance.request({
        url: '/users/getUserInfo',
        method: 'get'
    })
}

export function referTokenApi(data: any) {
    return axiosInstance.request({
        url: '/user/referToken',
        method: 'post',
        data: data
    })
}

//注册
// 登录接口
export function registerApi(data: any) {
    return axiosInstance.request({
        url: '/users/register',
        method: 'post',
        data: data
    })
}

//搜索用户
export function searchUserApi(data: any) {
    return axiosInstance.request({
        url: `/users/searchUser?params=${data}`,
        method: 'get'
    })
}

//发送好友请求
export function sendFriendRequestApi(data: any) {
    return axiosInstance.request({
        url: `/fiends/addFriendRequest?userId=${data.userId}&friendId=${data.friendId}`,
        method: 'post',
        data: data
    })
}
//获取好友请求
export function getFriendRequestApi(params: any) {
    return axiosInstance.request({
        url: '/fiends/getFriendsRequestList?userId='+params.userId,
        method: 'get'
    })
}
// acceptFriendRequest
//获取好友请求
export function acceptFriendRequestApi(params: any) {
    return axiosInstance.request({
        url: '/fiends/acceptFriendRequest',
        method: 'post',
        data: params
    })
}