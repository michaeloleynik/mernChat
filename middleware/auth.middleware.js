const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS') {
		return next();
	}

	try {
		const token = req.headers.autharization.split(' ')[1];

		if (!token) {
			return res.status(401).json({message: "You must to login or register!", status: 401});
		}

		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded;

		next();

	} catch (e) {
		return res.status(401).json({message: "You must to login or register!", status: 401});
	}
}