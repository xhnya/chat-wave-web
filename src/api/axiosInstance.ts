import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {referTokenApi} from "./userApi.ts";

// 创建 Axios 实例
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:9000', // 设置基础URL
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
            config.headers['X-Refresh-Token'] = `Bearer ${refreshToken}`;  // 添加刷新令牌到请求头
        }
        return config;
    },
    (error) => {
        ElMessage.error('请求错误，请重试');
        // 处理请求错误
        return Promise.reject(error);
    }
);

let isRefreshing = false;  // 标记是否正在刷新令牌
let failedQueue: any[] = []; // 保存请求失败队列

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 你可以在这里处理响应数据，比如全局错误处理等
        const newAccessToken = response.headers['new-access-token'];
        if (newAccessToken) {
            // 如果响应头中包含新的 access_token，则更新 localStorage 中的 token
            localStorage.setItem('chat-wave-access_token', newAccessToken);
        }
        return response.data; // 只返回响应的 data 部分
    },
    async (error) => {
        // 处理响应错误
        const originalRequest = error.config;

        // 如果是 401 错误且令牌过期，尝试刷新令牌
        if (error.response && error.response.status === 401) {
            const refreshTokenValid = error.response.headers['refresh-token-valid'];
            console.log('refreshTokenValid', error.response);
            console.log('refreshTokenValid', refreshTokenValid);
            if (refreshTokenValid === "false") {
                // 刷新令牌过期，需要重新登录
                localStorage.removeItem('chat-wave-access_token');
                localStorage.removeItem('chat-wave-refresh_token');
                ElMessage.error('访问令牌失效，请重新登录');

                const router = useRouter();
                try {
                    await router.push('/login'); // 处理 Promise
                } catch (err) {
                    console.error('跳转到登录页失败', err);
                }

                return Promise.reject(error); // 跳转后直接返回拒绝 Promise
            } else if (!isRefreshing) {
                // 如果没有正在刷新令牌，刷新令牌并更新请求头
                isRefreshing = true;

                try {
                    const res = await referTokenApi({});

                    const { accessToken, refreshToken } = res.data;

                    // 更新本地存储中的令牌
                    localStorage.setItem('chat-wave-access_token', accessToken);
                    localStorage.setItem('chat-wave-refresh_token', refreshToken);

                    // 将队列中的请求进行重试
                    failedQueue.forEach((callback) => callback(accessToken, refreshToken));
                    failedQueue = []; // 清空队列

                    // 更新原始请求的头
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['X-Refresh-Token'] = `Bearer ${refreshToken}`;

                    // 重新发起请求
                    return axiosInstance(originalRequest);
                } catch (error) {
                    // 刷新令牌失败，清空缓存的令牌并跳转到登录页
                    localStorage.removeItem('chat-wave-access_token');
                    localStorage.removeItem('chat-wave-refresh_token');
                    ElMessage.error('刷新令牌失败，请重新登录');

                    const router = useRouter();
                    try {
                        await router.push('/login');
                    } catch (err) {
                        console.error('跳转到登录页失败', err);
                    }

                    return Promise.reject(error); // 跳转后返回拒绝 Promise
                } finally {
                    isRefreshing = false; // 刷新令牌过程结束
                }
            }

            // 如果正在刷新令牌，加入队列等待令牌刷新完毕后再重试
            return new Promise((resolve) => {
                failedQueue.push((accessToken: string, refreshToken: string) => {
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['X-Refresh-Token'] = `Bearer ${refreshToken}`;
                    resolve(axiosInstance(originalRequest));
                });
            });
        }


        //弹出错误提示
        ElMessage.error(error.response.data.message);

        // 如果不是 401 错误，直接返回错误
        return Promise.reject(error);
    }
);


export default axiosInstance;
/**
 * 遵守rest统一返回结果的请求调用
 * 否则使用默认导出
 */
export function restRequest<R = any>(config: AxiosRequestConfig) {
    return (axiosInstance as AxiosInstance).request<R>(config);  // 返回类型应该是 R
}