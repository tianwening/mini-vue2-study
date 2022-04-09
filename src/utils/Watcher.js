import Dep from './Dep'
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        // 将Dep.target设置成该watcher
        Dep.target = this
        this.vm[this.key];

        Dep.target = null
    }
    update() {
        this.cb(this.vm[this.key])
    }
}

export default Watcher