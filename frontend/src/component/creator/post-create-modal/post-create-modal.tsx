"use client"

import { Dialog, DialogTitle, DialogContent, TextField, Button, Stack, Box, } from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "@/redux/hooks.ts"
import { enqueueSnackbar } from "notistack"
import styles from "./post-create-modal.module.css"
import { PostSchema, PostSchemaFormType } from "@/schemas/post"
import { createPost } from "@/redux/feature/user/user-action"

export default function PostFormModal({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PostSchemaFormType>({
        resolver: zodResolver(PostSchema),
    })

    const onSubmit = async (data: PostSchemaFormType) => {
        try {
            const res = await dispatch(createPost(data)).unwrap();
            if (res) {
                reset()
                onClose()
            }
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} className={styles.container}>
            <DialogTitle>Create Feedback</DialogTitle>

            <DialogContent className={styles.containerContent}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Stack className={styles.stack}>
                        <TextField
                            label="Title"
                            {...register("title")}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            className={styles.field}
                        />

                        <TextField
                            label="content"
                            multiline
                            rows={3}
                            {...register("content")}
                            error={!!errors.content}
                            helperText={errors.content?.message}
                            className={styles.field}
                        />

                        <Box className={styles.buttonWrapper}>
                            <Button type="submit" variant="contained" className={styles.button}>
                                Submit
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>
    )
}