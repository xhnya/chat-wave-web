import axiosInstance from './axiosInstance';

// 登录接口
export function loginApi(data: any) {
    return axiosInstance.request({
        url: '/user/login',
        method: 'post',
        data: data
    })
}

export function getUserInfoApi(data: any) {
    return axiosInstance.request({
        url: '/user/getUserInfo',
        method: 'post',
        data: data
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