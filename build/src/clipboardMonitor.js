"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClipboardMonitor = void 0;
var EventEmitter = require('events').EventEmitter;
var ClipboardMonitor = /** @class */ (function (_super) {
    __extends(ClipboardMonitor, _super);
    function ClipboardMonitor(clipboard) {
        var _this = _super.call(this) || this;
        _this.previous = null;
        _this.timerId = null;
        _this.clipboard = clipboard;
        return _this;
    }
    ClipboardMonitor.prototype.start = function () {
        var _this = this;
        this.timerId = setInterval(function () { return _this.checkForNewClipboardEntry(); }, 500);
    };
    ClipboardMonitor.prototype.stop = function () {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    };
    ClipboardMonitor.prototype.checkForNewClipboardEntry = function () {
        var current = this.clipboard.readText();
        if (current !== this.previous) {
            this.emit('copied', current);
            this.previous = current;
        }
        ;
    };
    return ClipboardMonitor;
}(EventEmitter));
exports.ClipboardMonitor = ClipboardMonitor;
