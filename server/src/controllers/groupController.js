import Group from "../models/Group.js";
import { z } from 'zod'

const createGroupSchema = z.object({
    name: z.string().min(3, "Group name must be at least 3 characters")
})

export const createGroup = async (req, res) => {
    try {
        const { name } = createGroupSchema.parse(req.body)
        const userId = req.user._id

        const group = await Group.create({
            name, 
            createdBy: userId,
            members: [userId]
        });

        const populatedGroup = await Group.findById(group._id).populate('members', 'name email');
        res.status(201).json(populatedGroup)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message })
        }
        res.status(500).json({ message: 'Server Error' })
    }
}

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId })
        .populate('members', 'name email')
        .sort({ updatedAt: -1 })
    
        res.json(groups)
    } catch (error) {
        res.status(500).json({ message: 'Sserver Error' })
    }
}

export const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
        .populate('members', 'name email upiId');

        if(!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const isMember = group.members.some(
            (member) => member._id.toString() === req.user._id.toString()
        )

        if(!isMember) {
            return res.status(403).json({ message: 'Not authorized to view this group' })
        }

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}