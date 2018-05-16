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
    this.ele = element;
  }

  /**
   * 添加事件监听
   * @param {String} type 事件名
   * @param {Function} cb 回调函数
   */
  add(type, cb) {
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
            cb.apply(this);
          }
        }
        this.ele.attachEvent('onpropertychange', callback);
        if (!this.ele[`cb:${type}`]) {
          this.ele[`cb:${type}`] = callback;
        }
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
    if (this.ele.removeEventListener) {
      this.ele.removeEventListener(type, cb, false);
    } else if (this.ele.attachEvent) {
      if (type.startsWith('custom')) {
        this.ele.detachEvent('onpropertychange', this.ele[`cb:${type}`]);
        this.ele[`cb:${type}`] = null;
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