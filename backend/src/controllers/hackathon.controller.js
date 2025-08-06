const Hackathon = require('../models/Hackathon');

//Get all hackathons for users( based on filters)

const getHackathons = async (req,res) => {
    try {
        const {
            page= 1,
            limit=12,
            college,
            tag,
            teamSize,
            search,
            sortBy='deadline',
            sortOrder= 'asc'
        } = req.query;

        const query ={};

        //college filter
        if(college){
            query.college= college;
        }

        if(tag){
            query.tags={$in : [tag]};
        }

        if(teamSize){
            query.teamSize= teamSize;
        }

        //search functionality( real time search as we type)
        if(search){
            query.$or=[
                {name : {$regex: search, $options: 'i'}},
                {tags: {$in: [new RegExp(search,'i')]}}
            ];
        }

        //for showing only future hackathons - temporarily disabled for testing
        // query.deadline = {$gte: new Date()};

        //sort
        const sortOptions={};
        sortOptions[sortBy]= sortOrder==='desc' ? -1: 1;

        const hackathons= await Hackathon.find(query)
            .sort(sortOptions)
            .limit(limit*1)
            .skip((page-1)*limit)
            .exec();
        
        const total = await Hackathon.countDocuments(query);

        res.status(200).json({
            success:true,
            data: hackathons,
            pagination:{
                currentPage: parseInt(page),
                totalPages: Math.ceil(total/limit),
                totalItems: total,
                itemsPerPage : parseInt(limit)
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

//get single hackahton details

const getHackathonDetails = async(req,res) =>{
    try {
        const {id} = req.params;

        const hackahton = await Hackathon.findById(id);

        if(!hackahton){
            return res.status(400).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        res.status(200).json({
            success: true,
            data: hackahton
        });

    } catch (error) {
        console.error('Error fetching hackathon details: ',error);
        res.status(500).json({
            success:false,
            message:'Server error while fetching hackthon details',
            error: error.message
        });
    }
}


// Get available tags for filtering
const getTags = async (req, res) => {
    try {
        const tags = await Hackathon.distinct('tags', {
            deadline: { $gte: new Date() }
        });

        res.status(200).json({
            success: true,
            data: tags.filter(tag => tag) // Remove empty values
        });

    } catch (error) {
         console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tags',
            error: error.message
        });
    }
};

module.exports = {
    getHackathons,
    getHackathonDetails,
    getTags
};