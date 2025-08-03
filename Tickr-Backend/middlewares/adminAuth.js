import jwt from 'jsonwebtoken';

// Middleware to check if user is authenticated and has admin role
export const requireAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: "Forbidden: Admin access required" 
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token" });
    }
};

// Middleware to check if user is authenticated and has admin or moderator role
export const requireAdminOrModerator = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if user has admin or moderator role
        if (!['admin', 'moderator'].includes(req.user.role)) {
            return res.status(403).json({ 
                error: "Forbidden: Admin or Moderator access required" 
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token" });
    }
};
