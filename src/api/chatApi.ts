import axiosInstance from './axiosInstance';

// 登录接口
export function loginApi(data: any) {
    return axiosInstance.request({
        url: '/users/login',
        method: 'post',
        data: data
    })
}



export function getChatListApi(userId: number) {
    return axiosInstance.request({
        url: '/chatlist/getChatList?userId='+userId,
        method: 'get'
    })
}