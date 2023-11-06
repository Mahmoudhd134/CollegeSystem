import {baseApi} from "./BaseApi";
import {SubjectModel} from "../Models/Subject/SubjectModel";
import {SubjectForPageModel} from "../Models/Subject/SubjectForPageModel";
import {AddSubjectModel} from "../Models/Subject/AddSubjectModel";
import {EditSubjectModel} from "../Models/Subject/EditSubjectModel";
import {SubjectReportModel} from "../Models/Subject/SubjectReportModel";
import {SubjectWithMaterialsModel} from "../Models/Subject/SubjectWithMaterialsModel";
import {SubjectWithStudentsModel} from "../Models/Subject/SubjectWithStudentsModel";

export const subjectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectByCode: builder.query<SubjectModel, number>({
            query: arg => ({url: 'subject/' + arg}),
            providesTags: (result) => [{type: 'subject', id: result?.id}]
        }),
        getSubjectPage: builder.query<SubjectForPageModel[],
            { pageIndex: number, pageSize: number, department?: string | undefined, year?: number | undefined, namePrefix?: string | undefined, hasDoctor?: boolean | undefined, completed?: boolean | undefined }>({
            query: args => ({
                url: `subject/${args.pageIndex}/${args.pageSize}`,
                params: {
                    'department': args.department,
                    'year': args.year,
                    'namePrefix': args.namePrefix,
                    'hasDoctor': args.hasDoctor,
                    'completed': args.completed
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
                {type: 'doctor', id: result?.doctor?.id ?? ''}
            ]
        }),
        getSubjectWithMaterials: builder.query<SubjectWithMaterialsModel, number>({
            query: arg => 'subject/materials/' + arg,
            providesTags: (result, error, arg) => [{type: 'subject', id: arg}]
        }),
        getSubjectWithStudents: builder.query<SubjectWithStudentsModel, number>({
            query: arg => 'subject/students/' + arg,
            providesTags: (result, error, arg) => [{type: 'subject', id: arg}]
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
    useGetSubjectWithMaterialsQuery,
    useGetSubjectWithStudentsQuery,
    useAddSubjectMutation,
    useEditSubjectMutation,
    useDeleteSubjectMutation,
    useDeleteAssignedDoctorMutation
} = subjectApi