import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    splitDetails: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            amountOwed: { type: Number, required: true },
            status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
        }
    ]
}, 
{
    timestamps: true
}
)

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;