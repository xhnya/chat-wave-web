import axiosInstance from './axiosInstance';

// 登录接口
export function loginApi(data: any) {
    return axiosInstance({
        url: '/login',
        method: 'post',
        data: data
    })
}