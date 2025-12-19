import Expense from "../models/Expense.js"
import Group from '../models/Group.js'
import { z } from "zod"

const createExpenseSchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    groupId: z.string()
})

export const createExpense = async (req, res) => {
    try {
        const { description, amount, groupId } = createExpenseSchema.parse(req.body);
        const paidBy = req.user._id;  

        const group = await Group.findById(groupId);
        if(!group) return res.status(400).json({ message: 'Group not found' })

        const numberOfMembers = group.members.length;
        const splitAmount = Number((amount/ numberOfMembers).toFixed(2));
        
        const splitDetails = group.members.map((memberId) => ({
            userId: memberId,
            amountOwed: memberId.toString() === paidBy.toString() ? 0: splitAmount,
            status: memberId.toString() === paidBy.toString() ? 'paid' : 'pending',
        }))

        const expense = await Expense.create({
            description,
            amount,
            group: groupId,
            paidBy,
            splitDetails
        })

        const populateExpense = await Expense.findById(expense._id)
        .populate('paidBy', 'name')
        .populate('splitDetails.user', 'name');

        res.status(201).json(populateExpense)
    } catch (error) {
        if(error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.errors[0].message
            })
        }
        res.status(500).json({ message: error.message || 'Server Error' })
    }
}

export const getGroupExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ group: req.params.groupId })
        .populate('paidBy', 'name')
        .sort({ createdAt: -1 });
        
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}
