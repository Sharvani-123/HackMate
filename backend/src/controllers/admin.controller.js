const Hackathon = require('../models/Hackathon');

/* /admin/hackathons */

const createHackathon = async (req,res) => {
    try {
        const{
            name,
            link,
            college,
            deadline,
            tags,
            teamSize
        } = req.body;

        //Validation
        if(!name || !college || !link){
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, college, link'
            });
        }

        if(!['Same College','Cross College'].includes(college)){
            return res.status(400).json({
                success: false,
                message: 'College must be either "Same College" or "Cross College"'
            });
        }

        //validating team size
        if(teamSize && !['1-3','2-4','3-4','5-6'].includes(teamSize)){
            return res.status(400).json({
                success: false,
                message: 'Invalid team size. Must be one of: 1-3 , 2-4, 3-4, 5-6'
            });
        }

        const newHackathon= new Hackathon({
            name,
            link: link,
            college,
            deadline: deadline || null,
            tags: tags || [],
            teamSize : teamSize|| null
        });
        await newHackathon.save();

        res.status(201).json({
            success: true,
            message: 'Hackathon created successfully',
            data: newHackathon
        });

    } catch (error) {
        console.error('Error creating hackathon: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating hackathon',
            error: error.message
        });
    }
}

const updateHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find hackathon
        const hackathon = await Hackathon.findById(id);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Validate college enum if being updated
        if (updateData.college && !['Same College', 'Cross College'].includes(updateData.college)) {
            return res.status(400).json({
                success: false,
                message: 'College must be either "Same College" or "Cross College"'
            });
        }

        // Validate teamSize enum if being updated
        if (updateData.teamSize && !['1-3', '2-4', '3-4', '5-6'].includes(updateData.teamSize)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team size. Must be one of: 1-3, 2-4, 3-4, 5-6'
             });
        }
        // Validate deadline if being updated
        if (updateData.deadline && new Date(updateData.deadline) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Deadline must be in the future'
            });
        }

        // Update hackathon
        const updatedHackathon = await Hackathon.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Hackathon updated successfully',
            data: updatedHackathon
        });
    } catch (error) {
        console.error('Error updating hackathon:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating hackathon',
            error: error.message
        });
    }
};

// Delete hackathon (Admin only)
const deleteHackathon = async (req, res) => {
    try {
        const { id } = req.params;

        const hackathon = await Hackathon.findById(id);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        await Hackathon.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Hackathon deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting hackathon:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting hackathon',
            error: error.message
        });
    }
};


// Get single hackathon (Admin view)
const getHackathonById = async (req, res) => {
    try {
        const { id } = req.params;

        const hackathon = await Hackathon.findById(id);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }
        res.status(200).json({
            success: true,
            data: hackathon
        });

    } catch (error) {
        console.error('Error fetching hackathon:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching hackathon',
            error: error.message
        });
    }
};

// Get all hackathons (Admin view) - FLEXIBLE
const getAllHackathons = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 100,  // High default for admin convenience
            status, 
            search 
        } = req.query;
        
        // Build query object for filtering
        const query = {};
        
        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        
        // If limit is 'all', return everything
        if (limit === 'all') {
            const hackathons = await Hackathon.find(query).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                data: hackathons,
                total: hackathons.length
            });
        }
        
        // Normal pagination
        const hackathons = await Hackathon.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Hackathon.countDocuments(query);

        res.status(200).json({
            success: true,
            data: hackathons,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching hackathons:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching hackathons',
            error: error.message
        });
    }
};


module.exports={
    createHackathon,
    updateHackathon,
    deleteHackathon,
    getHackathonById,
    getAllHackathons
};
