import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Receipt, Loader2, ArrowLeft } from 'lucide-react'
import { useGroupDetails } from "../hooks/useGroups";
import { useExpenses, useCreateExpense } from "../hooks/useExpense";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import strings from "../constants/strings";

const GroupDetails = () => {
    const { groupId } = useParams();
    const { user } = useAuth();

    const { data: group, isLoading: isGroupLoading } = useGroupDetails(groupId);
    const { data: expenses, isLoading: isExpenseLoading } = useExpenses(groupId);
    const createExpenseMutation = useCreateExpense();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({ description: '', amount: '' })

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.description || !formData.amount) return;

        await createExpenseMutation.mutateAsync({
            description: formData.description,
            amount: parseFloat(formData.amount),
            groupId
        });
        setFormData({ description: '', amount: '' })
        setIsModalOpen(false)
    }

    if (isGroupLoading || isExpenseLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/groups" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{group?.name}</h1>
                    <p className="text-gray-500 text-sm">{group?.members?.length} members</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">{strings.addExpense}</span>
                </button>
            </div>
            <div className="space-y-4">
                {expenses?.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Receipt className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500">{strings.noExpenses}</p>
                    </div>
                ) : (
                    expenses?.map((expense) => (
                        <div key={expense._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <Receipt className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                                    <p className="text-xs text-gray-500">
                                        Paid by <span className="font-medium text-gray-700">{expense.paidBy._id === user._id ? 'You' : expense.paidBy.name}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-gray-900 text-lg">₹{expense.amount}</span>
                                <span className="text-xs text-gray-400">{new Date(expense.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
                        <form onSubmit={handleCreate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dinner, Taxi"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GroupDetails;