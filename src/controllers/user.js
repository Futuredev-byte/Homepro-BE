import User from "../models/user.js";

export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;
        
        // If profile picture is provided, handle the upload to Cloudinary
        let profilePicture = null;
        if (req.file) {
            const imageResult = await cloudinary.uploader.upload(req.file.path);
            profilePicture = {
                url: imageResult.secure_url,
                imagePublicId: imageResult.public_id,
            };
        }

        // Update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { name: name || req.user.name, profilePicture },
            },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        console.error("Error updating profile:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// updateAgentStatus (i.e., setting isAgent status)
export const updateAgentStatus = async (req, res) => {
    try {
        const { userId, isAgent } = req.body;

        // Ensure the request is made by an admin or an authorized user
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { isAgent: isAgent } },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        console.error("Error updating agent status:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// getAllUsers (by admin only)
export const getAllUsers = async (req, res) => {
    try {
        // Ensure the request is made by an admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const users = await User.find().select("name email isAgent isAdmin _id");
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// getUserById
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error("Error fetching user by ID:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// getAgentById
export const getAgentById = async (req, res) => {
    try {
        const { agentId } = req.params;
        const agent = await User.findOne({ _id: agentId, isAgent: true }).select("name email isAgent _id profilePicture");

        if (!agent) {
            return res.status(404).json({ success: false, message: "Agent not found." });
        }

        res.status(200).json({ success: true, data: agent });
    } catch (err) {
        console.error("Error fetching agent by ID:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// getAllAgents
export const getAllAgents = async (req, res) => {
    try {
        const agents = await User.find({ isAgent: true }).select("userName email _id phoneNumber");
        res.status(200).json({ success: true, agents });
    } catch (err) {
        console.error("Error fetching agents:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};