const Tutor = require("../models/tutors");

exports.filtercontroller = async (req, res) => {
    const { subject, nameStartsWith, minExperience, maxExperience, availability, maxPrice } = req.query;

    try {
        // Construct a dynamic filter object
        const filter = {};

        // Filter by subject
        if (subject) {
            filter.subjects = subject;
        }

        // Filter by name starting letter
        if (nameStartsWith) {
            filter.name = new RegExp(`^${nameStartsWith}`, "i"); // Case-insensitive match for starting letter
        }

        // Filter by experience range
        if (minExperience || maxExperience) {
            filter.experience = {};
            if (minExperience) filter.experience.$gte = parseInt(minExperience);
            if (maxExperience) filter.experience.$lte = parseInt(maxExperience);
        }

        // Filter by availability
        if (availability) {
            filter.availability = availability; // Matches any availability value
        }

        // Filter by maximum price
        if (maxPrice) {
            filter.price = { $lte: parseFloat(maxPrice) };
        }

        // Fetch tutors based on the constructed filter
        const tutors = await Tutor.find(filter).select(
            "name experience qualifications expertise subjects availability price"
        );

        if (!tutors.length) {
            return res.status(404).json({ error: "No tutors found matching the criteria!" });
        }

        res.status(200).json(tutors);
    } catch (err) {
        console.error("Error fetching tutors:", err);
        res.status(500).json({ error: "Failed to fetch tutors!" });
    }
};
