
import { USER_URL } from "../constants.js";
import apiSlice from "./apiSlice.js";


export const userApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createUser:builder.mutation({
            query:(body)=>({
                url:`${USER_URL}/`,
                method:"POST",
                body,
            })
        }),
        login:builder.mutation({
            query:(body)=>({
                url:`${USER_URL}/login`,
                method:"POST",
                body,
            })
        }),
        logout:builder.mutation({
            query:()=>({
                url:`${USER_URL}/logout`,
                method:"POST",
            })
        }),
        verify:builder.mutation({
            query:(body)=>({
                url:`${USER_URL}/verify`,
                method:"POST",
                body,
            })
        }),
        resendToken:builder.mutation({
            query:(body)=>({
                url:`${USER_URL}/resend`,
                method:"POST",
                body,
            })
        }),
        updateProfile:builder.mutation({
            query:(body)=>({
                url:`${USER_URL}/profile`,
                method:"PUT",
                body
            })
        })


    })
})


export const {
    useCreateUserMutation,
    useLoginMutation,
    useLogoutMutation,
    useVerifyMutation,
    useResendTokenMutation,
    useUpdateProfileMutation
}=userApiSlice;