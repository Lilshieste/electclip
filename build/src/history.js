"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
var History = /** @class */ (function () {
    function History() {
        this.items = [];
    }
    History.prototype.addItem = function (item) {
        this.items.splice(0, 0, item);
    };
    return History;
}());
exports.History = History;
;
