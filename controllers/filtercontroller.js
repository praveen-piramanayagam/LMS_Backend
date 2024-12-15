const Tutor = require("../models/tutors");

exports.filtercontroller = async (req, res) => {
    try {
        const { subject, nameStartsWith, minExperience, maxExperience } = req.query;

        // Build a dynamic query
        const query = {};
        if (subject) query.subjects = new RegExp(subject, 'i'); // Case-insensitive subject filter
        if (nameStartsWith) query.name = new RegExp(`^${nameStartsWith}`, 'i'); // Name starts with
        if (minExperience) query.experience = { ...query.experience, $gte: parseInt(minExperience) };
        if (maxExperience) query.experience = { ...query.experience, $lte: parseInt(maxExperience) };

        // Fetch tutors matching the filters
        const filteredTutors = await Tutor.find(query);
        console.log("Filtered Tutors:", filteredTutors);

        res.status(200).json(filteredTutors);
    } catch (err) {
        console.error("Error fetching tutors:", err);
        res.status(500).json({ error: 'Failed to fetch tutors' });
    }
};