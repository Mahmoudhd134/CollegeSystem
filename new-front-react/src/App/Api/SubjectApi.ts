import {baseApi} from "./BaseApi";
import {SubjectModel} from "../../Models/Subject/SubjectModel";
import {SubjectForPageModel} from "../../Models/Subject/SubjectForPageModel";
import {AddSubjectModel} from "../../Models/Subject/AddSubjectModel";
import {EditSubjectModel} from "../../Models/Subject/EditSubjectModel";
import {SubjectReportModel} from "../../Models/Subject/SubjectReportModel";

export const subjectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectByCode: builder.query<SubjectModel, number>({
            query: arg => ({url: 'subject/' + arg}),
            providesTags: (result) => [{type: 'subject', id: result?.id}]
        }),
        getSubjectPage: builder.query<SubjectForPageModel[],
            { pageIndex: number, pageSize: number, department: string | undefined, year: number | undefined, namePrefix: string | undefined }>({
            query: args => ({
                url: `subject/${args.pageIndex}/${args.pageSize}`,
                params: {
                    'department': args.department,
                    'year': args.year,
                    'namePrefix': args.namePrefix
                }
            }),
            providesTags: (result = []) => [
                'subject',
                ...result.map(({id}) => ({type: 'subject' as const, id}))
            ]
        }),
        getSubjectReport: builder.query<SubjectReportModel, number>({
            query: arg => `subject/report/${arg}`,
            providesTags: (result, error, arg) => [
                {type: 'subject', id: arg},
                {type: 'doctor', id: result?.doctor.id}
            ]
        }),
        addSubject: builder.mutation<boolean, AddSubjectModel>({
            query: arg => ({
                url: 'subject',
                method: 'post',
                body: arg
            }),
            invalidatesTags: ['subject']
        }),
        editSubject: builder.mutation<boolean, EditSubjectModel>({
            query: arg => ({
                url: 'subject',
                method: 'put',
                body: arg
            }),
            invalidatesTags: (result, error, arg) => [{type: 'subject', id: arg.id}]

        }),
        deleteSubject: builder.mutation<boolean, number>({
            query: arg => ({
                url: 'subject/' + arg,
                method: 'delete'
            }),
            invalidatesTags: (result, error, arg) => [
                'doctor',
                {type: 'subject', id: arg}
            ]
        }),
        deleteAssignedDoctor: builder.mutation<boolean, number>({
            query: arg => ({
                url: 'subject/DeleteAssignedDoctor/' + arg,
                method: 'delete'
            }),
            invalidatesTags: (result, error, args) => [
                'doctor',
                {type: 'subject', id: args}
            ]
        })
    })
})
export const {
    useGetSubjectByCodeQuery,
    useGetSubjectPageQuery,
    useGetSubjectReportQuery,
    useAddSubjectMutation,
    useEditSubjectMutation,
    useDeleteSubjectMutation,
    useDeleteAssignedDoctorMutation
} = subjectApi