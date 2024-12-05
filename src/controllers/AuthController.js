const authService = require('../service/AuthService'); 

exports.clinicLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.clinicLogin(email, password);
    console.log('Clinic User Info:', user);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};


exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const user = await authService.getClinicUserFromToken(token);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { token, user } = await authService.refreshToken(refreshToken);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
