import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {ElMessage} from "element-plus";

// 创建 Axios 实例
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://api.example.com', // 设置基础URL
    timeout: 10000, // 设置请求超时
    headers: {
        'Content-Type': 'application/json;charset=UTF-8', // 设置请求头
    },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {  // 使用 InternalAxiosRequestConfig
        // 在请求发送前可以加一些处理逻辑，比如添加 token
        const accessToken = localStorage.getItem('chat-wave-access_token');  // 获取访问令牌
        const refreshToken = localStorage.getItem('chat-wave-refresh_token'); // 获取刷新令牌
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;  // 添加访问令牌到请求头
        }

        if (refreshToken) {
            config.headers['X-Refresh-Token'] = refreshToken;  // 添加刷新令牌到请求头
        }
        return config;
    },
    (error) => {
        // 处理请求错误
        return Promise.reject(error);
    }
);


// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 你可以在这里处理响应数据，比如全局错误处理等
        //获取请求头

        // 假设后端返回的数据包含新的令牌
        const newAccessToken = response.headers['new-access-token'];
        if (newAccessToken) {
            // 如果响应头中包含新的 access_token，则更新 localStorage 中的 token
            localStorage.setItem('chat-wave-access_token', newAccessToken);
        }
        return response.data; // 只返回响应的 data 部分
    },
    (error) => {
        // 处理响应错误
        if (error.response.status === 401) {
            // 如果访问令牌失效，可以用刷新令牌去刷新
            ElMessage.error('访问令牌失效，请重新登录');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
/**
 * 遵守rest统一返回结果的请求调用
 * 否则使用默认导出
 */
export function restRequest<R = any>(config: InternalAxiosRequestConfig) {
    return (axiosInstance as AxiosInstance).request<InternalAxiosRequestConfig, InternalAxiosRequestConfig<R>>(config)
}
