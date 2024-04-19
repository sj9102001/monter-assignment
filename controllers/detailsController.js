const User = require("../models/User");

exports.updateDetails = async (req, res) => {
    try {
        const { user } = req;
        const { location, age, work_details } = req.body;
        user.location = location;
        user.age = age;
        user.work_details = work_details;

        await user.save();

        res.status(200).json({ message: "Detail Updated" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getDetails = async (req, res) => {
    try {
        const { user } = req;

        res.status(200).json({
            details: {
                location: user.location, age: user.age, work_details: user.work_details, email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}