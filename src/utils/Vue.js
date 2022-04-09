import Reactive from './Reactive'
import Complier from './Complier'

class Vue {
    constructor(options) {
        // 配置初始化
        this.$options = options || {}
        this.$data = options.data || {}
        this.$methods = options.methods || {}
        this.$el = options.el
        this.init()
    }

    init() {
        // 响应式初始化
        new Reactive(this)
        // 开始编译
        new Complier(this.$el, this)
        this.$options.created && this.$options.created.call(this)
    }
}

export default Vue