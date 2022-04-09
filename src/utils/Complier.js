import Watcher from './Watcher'

class Complier {
    constructor(el, vm) {
        this.$el = typeof el === 'string' ? document.querySelector(el) : el
        this.$vm = vm
        this.$fragment = this.node2Fragment(this.$el)
        this.compile(this.$fragment)
        this.$el.appendChild(this.$fragment)
    }
    node2Fragment(el) {
        let child
        let fragment = document.createDocumentFragment()
        while ((child = el.firstChild)) {
            fragment.appendChild(child)
        }
        return fragment
    }
    compile(node) {
        if (this.isElement(node)) {
            this.compileElement(node)
        } else if (this.isTextNode(node)) {
            this.compileText(node)
        }
        let childNodes = node.childNodes
        if (childNodes && childNodes.length > 0) {
            Array.from(childNodes).forEach(node => {
                this.compile(node)
            })
        }
    }

    isElement(node) {
        return node && node.nodeType === 1
    }

    isTextNode(node) {
        return node && node.nodeType === 3
    }

    compileElement(node) {
        const nodeAttr = node.attributes
        Array.from(nodeAttr).forEach(attr => {
            const attrName = attr.name
            const exp = attr.value
            if (attrName.startsWith('v-')) {
                const dir = attrName.slice(2)
                this[dir] && this[dir](node, exp)
            }
            if (attrName.startsWith("@")) {
                const event = attrName.slice(1)
                node.addEventListener(event, () => {
                    this.$vm[exp] && this.$vm[exp]()
                })
            }
        })
    }
    compileText(node) {
        if (this.isValidate(node)) {
            this.update(node, RegExp.$1, 'text')
        }
    }
    isValidate(node) {
        return /\{\{(.*)\}\}/.test(node.textContent)
    }
    update(node, exp, dir) {
        const updater = this[dir + 'Update']
        updater && updater(node, this.$vm[exp])
        new Watcher(this.$vm, exp, value => {
            updater && updater(node, value)
        })
    }
    textUpdate(node, value) {
        node.textContent = value
    }
    valueUpdate(node, value) {
        node.value = value
    }
    text(node, exp) {
        this.update(node, exp, 'text')
    }
    model(node, exp) {
        this.update(node, exp, 'value')
        node.addEventListener('input', e => {
            this.$vm[exp] = e.target.value
        })
    }
}

export default Complier