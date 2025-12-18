const jwt = require('jsonwebtoken');

const generateToken = (res, userId, userRole) => {
  const token = jwt.sign(
    { userId, role: userRole }, 
    process.env.JWT_SECRET,    
    { expiresIn: '8h' }       
  );


  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', 
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 
  });
};

module.exports = generateToken;