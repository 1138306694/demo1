import axios from 'axios'

axios.defaults.timeout = 50000;      //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/json';        //配置请求头
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.put['X-SOURCE-FROM']  = 'wechat';       //配置请求头
axios.defaults.headers.post['X-SOURCE-FROM']  = 'wechat';
axios.defaults.headers.get['X-SOURCE-FROM']  = 'wechat';

//跨域
axios.defaults.headers.get['Access-Control-Allow-Origin']  = '*';
axios.defaults.headers.post['Access-Control-Allow-Origin']  = '*';
axios.defaults.headers.put['Access-Control-Allow-Origin']  = '*';
axios.defaults.headers.delete['Access-Control-Allow-Origin']  = '*';

console.log(axios.defaults, '......axios.......');

//生产环境;  https://wechat.nxqlhhk.top/
axios.defaults.baseURL = 'https://wechat.nxqlhhk.top/' 
// 本地环境
// let ip = "localhost";
// let ip = "192.168.31.32";
// axios.defaults.baseURL = 'http://'+ip+':1999/'
// axios.defaults.headers.common['token'] = "";

// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    // 在发送请求之前做某件事
    // if(window.openId){
    //     config.headers.token = window.openId;
    // };
    console.log(config.data, '@@@@@@@');
    if (config.method == 'post' && config.data.pull) {
        // console.log(axios.interceptors.response);
        console.log(axios.defaults);
    }

    if (config.method == 'post' && config.data.file) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    }
    if (config.method === 'post') {
        config.data = JSON.stringify(config.data);
    }
    if (config.method === 'put') {
        config.data = JSON.stringify(config.data);
    }
    return config;
}, (error) => {
    console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做些事客流量
    if (!res.data.success || !res.success) {
        return Promise.resolve(res);
    }
    return res;
}, (error) => {
    console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}


// 返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: param })
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}




// 返回一个Promise(发送delete请求)
export function fetchDelete(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


export default {
    fetchPost,
    fetchGet,
    fetchDelete,
}


