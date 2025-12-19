import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import apis from "../constants/apis";

export const useExpenses = (groupId) => {
    return useQuery({
        queryKey: ['expenses', groupId],
        queryFn: async () => {
            const { data } = await api.get(apis.getExpensesByGroup(groupId))
            return data;
        },
        enabled: !!groupId
    })
}

export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (expenseData) => {
            const { data } = await api.post(apis.expense, expenseData);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['expenses', variables.groupId] })
        }
    })
}