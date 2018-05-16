/**
 * event.js
 * 处理native事件 && 自定义事件
 * 自定义事件需要遵守custom前缀
 */

class Event {
  
  /**
   * 构造函数
   * @param {Object} element DOM元素 
   */
  constructor(element) {
    if (element.nodeType === 3 || element.nodeType === 8) {
      this.isIgnore = true;
    }
    this.ele = element;
  }

  /**
   * 检查是否需要处理
   */
  checkIsIgnore() {
    if (this.isIgnore) {
      console.log('文本节点和注释节点不处理');
    }
    return this.isIgnore;
  }

  /**
   * 添加事件监听
   * @param {String} type 事件名
   * @param {Function} cb 回调函数
   */
  add(type, cb) {
    if (this.checkIsIgnore()) {
      return;
    }
    if (this.ele.addEventListener) {
      this.ele.addEventListener(type, cb, false);
    } else if (this.ele.attachEvent) {
      if (type.startsWith('custom')) {
        if (isNaN(this.ele.type)) {
          this.ele.type = 0;
        }
        const callback = (ev) => {
          ev = ev || window.event;
          if (ev.propertyName === type) {
            cb.apply(this.ele);
          }
        }
        this.ele.attachEvent('onpropertychange', callback);
        (!this.ele[`cb:${type}`] || new Map()).set(cb, callback);
      } else {
        this.ele.attachEvent(`on${type}`, cb);
      }
    } else {
      this.ele[`on${type}`] = cb;
    }
    return this;
  }

  /**
   * 删除事件监听
   * @param {String} type 事件名
   * @param {Function} cb 回调函数
   */
  remove(type, cb) {
    if (this.checkIsIgnore()) {
      return;
    }
    if (this.ele.removeEventListener) {
      this.ele.removeEventListener(type, cb, false);
    } else if (this.ele.attachEvent) {
      if (type.startsWith('custom') && this.ele[`cb:${type}`].has(cb)) {
        this.ele.detachEvent('onpropertychange', this.ele[`cb:${type}`].get(cb));
        this.ele[`cb:${type}`].delete(cb);
      } else {
        this.ele.detachEvent(`on${type}`, cb);
      }
    } else {
      this.ele[`on${type}`] = null;
    }
    return this;
  }

  /**
   * 触发事件
   * @param {String} type 事件名 
   */
  trigger(type) {
    if (this.checkIsIgnore()) {
      return;
    }
    if (this.ele.dispatchEvent) {
      let evt = document.createEvent('Event');
      evt.initEvent(type, true, true);
      this.ele.dispatchEvent(evt);
    } else {
      if (type.startsWith('custom')) {
        this.ele.type += 1;
      } else {
        this.ele.fireEvent(`on${type}`);
      }
    }
    return this;
  }
}