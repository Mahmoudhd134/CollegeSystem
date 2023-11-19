import {baseApi} from "./BaseApi";
import {AddMailModel} from "../Models/Mail/AddMailModel";
import {MailForSendListModel} from "../Models/Mail/MailForSendListModel";
import {MailModel} from "../Models/Mail/MailModel";
import {MailForReceivedListModel} from "../Models/Mail/MailForReceivedListModel";

const MailApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getMailById: builder.mutation<MailModel, number>({
            query: arg => 'mail/' + arg,
            invalidatesTags: (result, error, arg) => ['mail', {type: 'mail', id: arg}],
        }),
        getSendMails: builder.query<MailForSendListModel[], { pageIndex: number, pageSize: number }>({
            query: arg => ({
                url: 'mail/getSend',
                params: {
                    'pageSize': arg.pageSize,
                    'pageIndex': arg.pageIndex
                }
            }),
            providesTags: (result = []) => [
                'mail',
                ...result.map(({id}) => ({type: 'mail' as const, id}))
            ]
        }),
        getReceivedMails: builder.query<MailForReceivedListModel[], { pageIndex: number, pageSize: number }>({
            query: arg => ({
                url: 'mail/getReceived',
                params: {
                    'pageSize': arg.pageSize,
                    'pageIndex': arg.pageIndex
                }
            }),
            providesTags: (result = []) => [
                'mail',
                ...result.map(({id}) => ({type: 'mail' as const, id}))
            ]
        }),
        getIsHasUnReadMails: builder.query<boolean, void>({
            query: () => 'mail/checkUnReadMessages',
            providesTags: ['mail']
        }),
        addMail: builder.mutation<boolean, AddMailModel>({
            query: arg => ({
                url: `mail`,
                method: 'post',
                body: arg
            }),
            invalidatesTags: [{type: 'mail'}]
        }),
        deleteMail: builder.mutation<boolean, number>({
            query: arg => ({
                url: 'mail/' + arg,
                method: 'delete'
            }),
            invalidatesTags: (result, error, arg) => ['mail', {type: 'mail', id: arg}]
        })
    })
})

export const {
    useGetMailByIdMutation,
    useGetSendMailsQuery,
    useGetReceivedMailsQuery,
    useGetIsHasUnReadMailsQuery,
    useLazyGetIsHasUnReadMailsQuery,
    useAddMailMutation,
    useDeleteMailMutation
} = MailApi