import axiosInstance from "@/api/axiosInstance.ts";


export function getFriendsListApi(params: any) {
    return axiosInstance.request({
        url: `/fiends/getFriendsList?userId=${params.userId}`,
        method: 'get'
    })
}
