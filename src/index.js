let net = axios.create({
    baseURL: '/api',

});
net.interceptors.response.use(response => {
    let res = response.data;
    if(res.state == 0) {
        return res.data;
    } else {
        return Promise.reject(res);
    }
});

var app = new Vue({
    el: '#app',
    data: {
        contentList: [],
        formData: {},
        currentUser: {}
    },


    methods: {
        getContentList: function () {
            return net.get('/weibo/get', {
                params: {
                    pageSize: 10,
                    pageIndex: 1
                }
            }).then(data => {
                this.contentList = data;
            }).catch(err => {
                alert(err.message);
            });
        },
        createContent: function () {           

            return net.post(`/weibo/update`, {
                title: this.formData.title,
                content: this.formData.content,
            }).then(data => {
                return this.getContentList()           
            }).catch(err => {
                alert(err.message);
            });
        },

        getDetail: function(id) {
            return net.get(`/weibo/get/detail/${id}`).then(data => {
                console.log(data);
            }).catch(err => {
                alert(err.message);
            });
        },

        getCurrentUser: function() {
            return net.get(`/getCurrentUser`).then(data => {
                console.log(data);
                if(data.isAuthenticated) {
                    this.currentUser = data;
                }
            }).catch(err => {
                alert(err.message);
            });
        },

        login: function() {
            return net.post(`/login`, {
                username: 'admin',
                password: '123456'
            }).then(data => {
                console.log(data);
                return this.getCurrentUser();
            }).catch(err => {
                alert(err.message);
            });
        },

        logout: function() {
            return net.get(`/logout`).then(data => {
                console.log(data);
                this.currentUser = {};
            }).catch(err => {
                alert(err.message);
            });
        },

    },

    created: function () {
        this.getCurrentUser();
        this.getContentList();
    }
});