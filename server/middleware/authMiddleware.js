import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function protect(roles = []) {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Access token not found" });
            }
            const decoded = jwt.verify(token, config.JWT_SECRET);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: insufficient permissions" });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired access token" });
        }
    };
}
