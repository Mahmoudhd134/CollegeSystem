import {baseApi} from "./BaseApi";
import AddRoomModel from "../Models/Room/AddRoomModel";
import RoomModel from "../Models/Room/RoomModel";

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
        })
    })
})

export const {
    useGetRoomQuery,
    useAddRoomMutation,
    useJoinRoomMutation
} = RoomApi