import Vue from './utils/Vue.js'

const app = new Vue({
    el: '#app',
    data: {
        msg: 'hello world',
        age: 45
    },
    methods: {
        change() {
            this.msg = 'hello Vue'
        }
    },
    created() {
        console.log(this);
        setTimeout(() => {
            this.msg = 'hello created'
        }, 1000)
    }
})