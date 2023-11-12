import {baseApi} from "./BaseApi";
import AddStudentModel from "../Models/Student/AddStudentModel";
import StudentForPageModel from "../Models/Student/StudentForPageModel";
import StudentModel from "../Models/Student/StudentModel";
import {EditStudentModel} from "../Models/Student/EditStudentModel";
import {boolean} from "yup";

export const StudentApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getStudent: builder.query<StudentModel, string>({
            query: args => 'student/' + args,
            providesTags: (result, error, arg) => [
                'student',
                {type: 'student', id: arg}
            ]
        }),
        isAssignedToSubject: builder.query<boolean, number>({
            query: arg => 'student/isAssignToSubject/' + arg,
            providesTags: (result, error, arg) => [
                'subject',
                {type: 'subject', id: arg},
                'student'
            ]
        }),
        getStudentList: builder.query<StudentForPageModel[], { pageIndex: number, pageSize: number, usernamePrefix?: string }>({
            query: args => ({
                url: 'student',
                params: args
            }),
            providesTags: (result = []) => [
                'student',
                ...result.map(({id}) => ({type: 'student' as const, id}))
            ]
        }),
        addStudent: builder.mutation<boolean, AddStudentModel>({
            query: args => ({
                url: 'student',
                method: 'post',
                body: args
            }),
            invalidatesTags: ['student'],
        }),
        assignSubjectWithStudent: builder.mutation<boolean, number>({
            query: arg => ({
                url: 'student/assignToSubject/' + arg,
                method: 'post'
            }),
            invalidatesTags: (result, error, arg) => [
                'student',
                {type: 'student', id: arg},
                'subject',
            ]
        }),
        editStudent: builder.mutation<boolean, EditStudentModel>({
            query: args => ({
                url: 'student',
                method: 'put',
                body: args
            }),
            invalidatesTags: (result, error, {id}) => ['student', {type: 'student', id}],
        }),
        deleteStudent: builder.mutation<boolean, string>({
            query: arg => ({
                url: 'student/' + arg,
                method: 'delete'
            }),
            invalidatesTags: (result, error, arg) => [
                'student',
                'subject',
                {type: 'student', id: arg}
            ]
        }),
        deAssignSubjectFromStudent: builder.mutation<boolean, number>({
            query: arg => ({
                url: 'student/deAssignFromSubject/' + arg,
                method: 'delete'
            }),
            invalidatesTags: (result, error, arg) => [
                'student',
                {type: 'student', id: arg},
                'subject',
            ]
        }),
    })
})

export const {
    useGetStudentListQuery,
    useLazyIsAssignedToSubjectQuery,
    useGetStudentQuery,
    useAddStudentMutation,
    useAssignSubjectWithStudentMutation,
    useEditStudentMutation,
    useDeleteStudentMutation,
    useDeAssignSubjectFromStudentMutation
} = StudentApi