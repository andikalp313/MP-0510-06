"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
<<<<<<< HEAD
const event_router_1 = __importDefault(require("./routes/event.router"));
=======
const auth_router_1 = __importDefault(require("./routes/auth.router"));
>>>>>>> 24d487e0316c5523ee67aff25b5531fac2c875b4
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//routes
<<<<<<< HEAD
app.use("/events", event_router_1.default);
=======
app.use("/auth", auth_router_1.default);
>>>>>>> 24d487e0316c5523ee67aff25b5531fac2c875b4
//middleware
app.use((err, req, res, next) => {
    res.status(400).send(err.message);
});
app.listen(config_1.PORT, () => {
    console.log(`Server running on port ${config_1.PORT}`);
});
