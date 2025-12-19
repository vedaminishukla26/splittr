import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../lib/axios'
import apis from "../constants/apis";

export const useGroups = () => {
    return useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const { data } = await api.get(apis.group)
            return data
        }
    })
}

export const useGroupDetails = (groupId) => {
    return useQuery({
        queryKey: ['group', groupId],
        queryFn: async () => {
            const { data } = await api.get(apis.getGroupsById(groupId))
            return data;
        },
        enabled: !!groupId
    })
}

export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (groupData) => {
            const { data } = await api.post(apis.group, groupData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] })
        }
    })
}