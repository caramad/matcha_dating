
exports.ping = async (req, res) => {
	try {
		res.json({ message: "Ponga-me as bolas" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}