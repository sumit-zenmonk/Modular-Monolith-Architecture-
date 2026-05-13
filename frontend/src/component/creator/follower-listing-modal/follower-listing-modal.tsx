"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Stack, Button, } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { enqueueSnackbar } from "notistack"
import { RootState } from "@/redux/store"
import styles from "./follower-listing-modal.module.css"
import { fetchFollowers } from "@/redux/feature/user/user-action"
import { FollowerCreator } from "@/redux/feature/user/user-type"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"

export default function FollowerListingModal({ open, onClose, }: { open: boolean, onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { followers, total_follower_count } = useAppSelector((state: RootState) => state.userReducer);
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
            await dispatch(fetchFollowers({ offset: 0, limit, })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const fetchMore = async () => {
        try {
            if (followers.length >= total_follower_count) return;

            const newOffset = offset + limit;
            setOffset(newOffset);

            await dispatch(fetchFollowers({ offset: newOffset, limit, })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                follower Creators
            </DialogTitle>

            <DialogContent dividers id="followerScrollableDiv">
                <InfiniteScroll
                    dataLength={followers.length}
                    next={fetchMore}
                    hasMore={followers.length < total_follower_count}
                    loader={<Typography>Loading...</Typography>}
                    scrollableTarget="followerScrollableDiv"
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                >
                    <Stack spacing={2}>
                        {followers.map((item: FollowerCreator) => (
                            <Card key={item.uuid} className={styles.card}                            >
                                <CardContent className={styles.cardContent}
                                >
                                    <Box className={styles.header}
                                    >
                                        <Typography variant="h6">
                                            {item.follower.name}
                                        </Typography>

                                        <Typography className={styles.role}
                                        >
                                            {item.follower.role}
                                        </Typography>
                                    </Box>

                                    <Typography className={styles.email}
                                    >
                                        {item.follower.email}
                                    </Typography>

                                    <Box className={styles.footer}
                                    >
                                        <Typography>
                                            UUID:{" "}
                                            {item.follower.uuid}
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