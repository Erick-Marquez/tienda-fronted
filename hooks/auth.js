import useSWR from "swr"
import { useRouter } from "next/router"
import { AuthService } from "../services/AuthService"
import { useEffect } from "react"

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        AuthService.user()
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                // router.push('/verify-email')
            }),
    )

    const csrf = () => AuthService.getCsrfCookie()

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        AuthService.login(props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const logout = async () => {
        if (!error) {
            await AuthService.logout().then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])


    return {
        user,
        // register,
        login,
        // forgotPassword,
        // resetPassword,
        // resendEmailVerification,
        logout,
    }
}