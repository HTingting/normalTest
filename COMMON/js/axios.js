/*还没写完。。。。。。*/
/**
 * public.js
 * user.js
 * article.js
 * config.js
 */
import axios from 'axios';

//封装的目的是对封装公共的拦截器，每个实例都有单独自己的拦截器

// 创建一个单独的实例，每次请求都是用这个方法来创建实例
class Http{
    constructor() {
        this.timeout = 3000;  //超时时间
        this.baseURL = process.env.NODE_ENV == 'development' ? '' : '';
    }
    mergeOptions(options) {
        return {
            timeout: this.timeout,
            baseURL: this.baseURL,
            ...options
        }
    }

    setInterceptor(instance) {
        instance.interceptor.request.use((config) => {
            return config;
        })
        instance.interceptors.response.use(res => {
            if(res.status == 200) {
                if(res.data.err == 1){
                    return Promise.reject(res.data);
                }
                return Promise.resolve(res.data);
            }else{
                return Promise.reject(res);
            }
            return res.data;
        },err => {
            return Promise.reject()
        })
    }

    request(options){   // 用户参数 + 默认参数  = 总共参数
        const opts = this.mergeOptions(options);
        const axiosInstance = axios.create();

        // 添加拦截期
        this.setInterceptor(axiosInstance);

        // 当调用axios.request的时候，内部就会创建一个axios实例，并且给这个实例传入配置实例
        return axiosInstance(opts);
    }

    // 这两个方法只是对request方法 的一个简写而已
    get(url,config = {}){
        return this.request({
            url:url,
            method:'get',
            ...config
        })
    }
    post(url,data){

        // 对data进行格式化
        return this.request({
            method:'post',
            url,
            data
        })
    }
}
export default new Http
