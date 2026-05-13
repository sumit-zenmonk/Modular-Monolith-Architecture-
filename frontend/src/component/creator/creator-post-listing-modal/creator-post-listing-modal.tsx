"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Stack, Button, } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { enqueueSnackbar } from "notistack"
import { RootState } from "@/redux/store"
import styles from "./creator-post-listing-modal.module.css"
import { deletePost, fetchCreatorPosts, } from "@/redux/feature/user/user-action"
import { Post } from "@/redux/feature/user/user-type"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"

export default function CreatorPostListingModal({ open, onClose, }: { open: boolean, onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { total_post_count, posts } = useAppSelector((state: RootState) => state.userReducer);
    const [offset, setOffset] = useState(0)
    const limit = Number(process.env.page_limit) || 10

    useEffect(() => {
        if (open) {
            resetAndFetch()
        }
    }, [open])

    const resetAndFetch = async () => {
        try {
            setOffset(0);
            await dispatch(fetchCreatorPosts({ offset: 0, limit, })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const fetchMore = async () => {
        try {
            if (posts.length >= total_post_count) return;

            const newOffset = offset + limit;
            setOffset(newOffset);

            await dispatch(fetchCreatorPosts({ offset: newOffset, limit, })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const handlePostDelete = async (uuid: string) => {
        try {
            await dispatch(deletePost({ uuid })).unwrap()
            enqueueSnackbar("Creator unfollowed successfully", { variant: "success", })

            await resetAndFetch()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Post Listing
            </DialogTitle>

            <DialogContent dividers id="followingScrollableDiv">
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMore}
                    hasMore={posts.length < total_post_count}
                    loader={<Typography>Loading...</Typography>}
                    scrollableTarget="followingScrollableDiv"
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                >
                    <Stack spacing={2}>
                        {posts.map((item: Post) => (
                            <Card key={item.uuid} className={styles.card}>
                                <CardContent className={styles.cardContent}
                                >
                                    <Box className={styles.header}
                                    >
                                        <Typography variant="h6">
                                            {item.title}
                                        </Typography>

                                        <Typography className={styles.role}
                                        >
                                            {item.content}
                                        </Typography>
                                    </Box>

                                    <Box className={styles.footer}
                                    >
                                        <Typography>
                                            UUID:{" "}
                                            {item.uuid}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={async () => await handlePostDelete(item.uuid)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                        )}
                    </Stack>
                </InfiniteScroll>
            </DialogContent>
        </Dialog>
    )
}