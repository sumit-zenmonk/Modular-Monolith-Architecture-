"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Stack, Button, } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { enqueueSnackbar } from "notistack"
import { RootState } from "@/redux/store"
import styles from "./user-post-listing-modal.module.css"
import { fetchFollowingCreatorsPosts } from "@/redux/feature/user/user-action"
import { FollowingCreatorPost } from "@/redux/feature/user/user-type"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"

export default function UserPostListingModal({ open, onClose, }: { open: boolean, onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { total_following_posts_count, following_creators_posts } = useAppSelector((state: RootState) => state.userReducer);
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
            await dispatch(fetchFollowingCreatorsPosts({ offset: 0, limit, })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const fetchMore = async () => {
        try {
            if (following_creators_posts.length >= total_following_posts_count) return;

            const newOffset = offset + limit;
            setOffset(newOffset);

            await dispatch(fetchFollowingCreatorsPosts({ offset: newOffset, limit, })).unwrap();
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
                    dataLength={following_creators_posts.length}
                    next={fetchMore}
                    hasMore={following_creators_posts.length < total_following_posts_count}
                    loader={<Typography>Loading...</Typography>}
                    scrollableTarget="followingScrollableDiv"
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                >
                    <Stack spacing={2}>
                        {following_creators_posts.map((item: FollowingCreatorPost) => (
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