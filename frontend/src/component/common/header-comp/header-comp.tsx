"use client"

import { useRouter } from "next/navigation"
import { Box, Button } from "@mui/material"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import styles from "./header-comp.module.css"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { UserRoleEnum } from "@/enums/user.enum"
import { enqueueSnackbar } from "notistack"

export default function HeaderComp() {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.authReducer)

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/")
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    return (
        <header className={styles.header}>
            <Box className={styles.leftContainer}>
                <p onClick={() => {
                    router.push("/")
                }}>MicroService Post App</p>
            </Box>

            <Box className={styles.rightContainer}>
                {user ? (
                    <>
                        {user.role === UserRoleEnum.USER && (
                            <Button
                                variant="outlined"
                                onClick={async () => { router.push('/user') }}
                            >
                                User
                            </Button>
                        )}

                        {user.role === UserRoleEnum.CREATOR && (
                            <Button
                                variant="outlined"
                                onClick={async () => { router.push('/creator') }}
                            >
                                creator
                            </Button>
                        )}

                        <Button
                            variant="outlined"
                            sx={{ color: "#DB2D43", borderColor: "#DB2D43" }}
                            onClick={async () => { await handleLogOut() }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            router.push("/login")
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </header >
    )
}