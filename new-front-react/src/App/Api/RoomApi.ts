import {baseApi} from "./BaseApi";
import AddRoomModel from "../Models/Room/AddRoomModel";
import RoomModel from "../Models/Room/RoomModel";
import EditRoomModel from "../Models/Room/EditRoomModel";

export const RoomApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getRoom: builder.query<RoomModel, string>({
            query: arg => 'room/' + arg,
            providesTags: (result, error, arg) => [
                {type: 'room', id: arg}
            ]
        }),
        addRoom: builder.mutation<boolean, AddRoomModel>({
            query: arg => ({
                url: 'room',
                method: 'post',
                body: arg
            }),
            invalidatesTags: (result, error, arg) => [
                'room',
                'subject',
                {type: 'subject', id: arg.subjectId}
            ]
        }),
        joinRoom: builder.mutation<boolean, string>({
            query: arg => ({
                url: 'room/join-user/' + arg,
                method: 'post'
            }),
            invalidatesTags: (result, error, arg) => [
                'room',
                {type: 'room', id: arg}
            ]
        }),
        editRoom: builder.mutation<boolean, EditRoomModel>({
            query: arg => ({
                url: 'room',
                method: 'put',
                body: arg,
            }),
            invalidatesTags: (result, error, arg) => [
                'room',
                'subject',
                {type: 'room', id: arg.id}
            ]
        }),
        changeRoomImage: builder.mutation<boolean, { body: FormData, id: string }>({
            query: ({id, body}) => ({
                url: 'room/' + id,
                method: 'put',
                body
            }),
            invalidatesTags: (result, error, {id}) => [
                'room',
                'subject',
                {type: 'room', id}
            ]
        }),
        deleteRoom: builder.mutation<boolean, string>({
            query: arg => ({
                url: 'room/' + arg,
                method: 'delete',
            }),
            invalidatesTags: (result, error, arg) => [
                'room',
                'subject',
                {type: 'room', id: arg}
            ]
        }),
    })
})

export const {
    useGetRoomQuery,
    useAddRoomMutation,
    useJoinRoomMutation,
    useEditRoomMutation,
    useChangeRoomImageMutation,
    useDeleteRoomMutation
} = RoomApi