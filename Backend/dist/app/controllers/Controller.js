"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
class Controller {
    static getInstance() {
        if (!Controller.instance) {
            Controller.instance = new this();
        }
        return Controller.instance;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map