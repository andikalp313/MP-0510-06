"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = void 0;
const checkUserRole = (req, res, next) => {
    const user = res.locals.user;
    // Cek apakah user memiliki role ORGANIZER
    if (user && user.role === "ADMIN") {
        return next();
    }
    res.status(403).json({
        status: "error",
        message: "Access denied. Only Admin can do this action.",
    });
};
exports.checkUserRole = checkUserRole;
