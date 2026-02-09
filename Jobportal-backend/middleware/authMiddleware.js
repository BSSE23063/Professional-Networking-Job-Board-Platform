const jwt = require('jsonwebtoken');
const User = require('../models/User');




const protect = async (req, res, next) => {
   // 1. Read header
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
   }

   // 2. Decode token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
   // 3. Attach user to req
   req.user = user;
    next();
   // 4. Call next()
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}
module.exports = { protect };