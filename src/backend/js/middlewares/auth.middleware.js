module.exports = (req, res) => {
	try {
		res.json({
			success:true,
			user: req.user,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error"});
	}
}