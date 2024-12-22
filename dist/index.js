"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const event_router_1 = __importDefault(require("./routes/event.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const voucher_router_1 = __importDefault(require("./routes/voucher.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//routes
app.use("/events", event_router_1.default);
app.use("/auth", auth_router_1.default);
app.use("/vouchers", voucher_router_1.default);
//middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({ error: err.message });
});
app.listen(config_1.PORT, () => {
    console.log(`Server running on port ${config_1.PORT}`);
});
