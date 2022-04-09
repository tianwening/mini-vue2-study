import Dep from './Dep'

class Reactive {
    constructor(vm) {
        this.$vm = vm
        this.$data = vm.$data
        this.$methods = vm.$methods
        // 对vm自身的数据进行代理
        this.proxy(this.$data)
        this.proxy(this.$methods)
        this.walk()
    }

    proxy(target) {
        Object.keys(target).forEach(key => {
            Object.defineProperty(this.$vm, key, {
                get() {
                    return target[key]
                },
                set(newValue) {
                    target[key] = newValue
                }
            })
        })
    }

    walk() {
        this.observe(this.$data)
    }

    observe(data) {
        if (!data || typeof data !== 'object') {
            return data
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(obj, key, value) {
        this.observe(value)
        const dep = new Dep()
        Object.defineProperty(obj, key, {
            get() {
                // 收集依赖
                Dep.target && dep.addDep(Dep.target)
                // console.log('getter');
                return value
            },
            set(newValue) {
                // console.log("setter")
                if (newValue === value) {
                    return
                }
                value = newValue
                // 触发更新
                dep.notify()
            }
        })
    }
}

export default Reactive