import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Loader2 } from 'lucide-react'
import { useGroups, useCreateGroup } from "../hooks/useGroups";
import strings from "../constants/strings";

const Groups = () => {
    const { data: groups, isLoading, isError } = useGroups();
    const createGroupMutation = useCreateGroup();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [groupName, setGroupName] = useState('')

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;

        await createGroupMutation.mutateAsync({
            name: groupName
        });
        setGroupName('');
        setIsModalOpen(false);
    }

    if (isLoading) return
    (<div className="flex justify-center p-10" >
        <Loader2 className="animate-spin text-blue-600" />
    </div>)

    if (isError) return
    (<div className="p-8 text-red-600">{strings.failedGrps}</div>)

    return (
        <div className="p-6 max-w-6xl mx-auto" >
            <div className="flex flex-row justify-between mb-4 ">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{strings.yourGroups}</h1>
                <p className="text-gray-500 text-sm mt-1">{strings.createAgrp}</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
                <Plus size={20} />
                {strings.createGroup}
            </button>
            </div>
            {groups?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{strings.noGroups}</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-600 font-medium hover:underline mt-2"
                    >
                        {strings.createGroup}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups?.map((group) => (
                        <Link
                            key={group._id}
                            to={`/groups/${group._id}`}
                            className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {group.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-100 font-medium">
                                    {group.members.length} {strings.members}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {group.name}
                            </h3>
                            <p className="text-xs text-gray-400">
                                Created {new Date(group.createdAt).toLocaleDateString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4"
                onClick={closeModal}
                >
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">{strings.createNewGrp}</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1"></label>
                                <input
                                    type="text"
                                    placeholder={strings.groupNamePlaceholder}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    {strings.cancel}
                                </button>
                                <button
                                    type="submit"
                                    disabled={createGroupMutation.isPending || !groupName.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createGroupMutation.isPending ? strings.creating : strings.create}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Groups