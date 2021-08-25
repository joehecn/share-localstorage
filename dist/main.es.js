var version = "1.1.0";

var global = typeof window === 'object' ? window : undefined;
if (!global.HTMLElement)
    console.warn('share-localstorage is meant to run on browsers main thread');
var _src = 'https://joehecn.github.io/share-localstorage/?version=1.0.0';
var _iframe = null;
// 事件总线对象
var _jEvent = {
    eventMap: {},
    // 触发事件
    emit: function (event, params) {
        var callback = this.eventMap[event];
        if (callback) {
            callback(params);
            delete this.eventMap[event];
        }
    },
    // 注册一次性事件
    once: function (event, callback) {
        this.eventMap[event] = callback;
    },
    // 移除事件
    off: function (event) {
        if (event) {
            this.eventMap[event] && delete this.eventMap[event];
            return;
        }
        // 移除所有事件
        this.eventMap = {};
    }
};
var _uuid = function () {
    return Number(Math.random().toString().substr(3, 4) + Date.now()).toString(36);
};
var _onMessage = function (e) {
    var data = JSON.parse(e.data);
    if (data.id) {
        _jEvent.emit(data.id, data);
    }
};
var _method = function (method, keyName, keyValue) {
    return new Promise(function (resolve, reject) {
        var id = _uuid();
        if (_iframe === null) {
            reject({ id: id, code: 1000, message: 'iframe is not ready!' });
            return;
        }
        _jEvent.once(id, function (data) {
            data.message ?
                reject(data) :
                resolve(data);
        });
        var channel = new MessageChannel();
        channel.port1.onmessage = _onMessage;
        _iframe.contentWindow.postMessage(JSON.stringify({
            id: id,
            method: method,
            keyName: keyName,
            keyValue: keyValue
        }), '*', [channel.port2]);
    });
};
var init = function (src) {
    return new Promise(function (resolve) {
        if (typeof src === 'string')
            _src = src;
        var iframe = document.createElement('iframe');
        iframe.addEventListener('load', function () {
            iframe['loaded'] = true;
            resolve(undefined);
        }, { once: true });
        iframe.hidden = true;
        iframe.src = _src;
        iframe.name = 'iframe-share-localstorage';
        iframe['loaded'] = false;
        iframe['isIframe'] = true;
        document.body.appendChild(iframe);
        _iframe = iframe;
    });
};
var destory = function () {
    _jEvent.off();
    document.body.removeChild(_iframe);
    _iframe = null;
};
var getItem = function (keyName) {
    return _method('getItem', keyName);
};
var setItem = function (keyName, keyValue) {
    return _method('setItem', keyName, keyValue);
};
var removeItem = function (keyName) {
    return _method('removeItem', keyName);
};
var main = {
    version: version,
    init: init,
    destory: destory,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem
};

export { main as default };
