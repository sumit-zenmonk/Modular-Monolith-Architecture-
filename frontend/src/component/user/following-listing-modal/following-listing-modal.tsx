"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Stack, Button, } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { enqueueSnackbar } from "notistack"
import { RootState } from "@/redux/store"
import styles from "./following-listing-modal.module.css"
import { fetchFollowingCreators, RemoveFollowBondWithCreator, } from "@/redux/feature/user/user-action"
import { FollowingCreator } from "@/redux/feature/user/user-type"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"

export default function FollowingListingModal({ open, onClose, }: { open: boolean, onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { followings, total_following_count } = useAppSelector((state: RootState) => state.userReducer);
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
            await dispatch(fetchFollowingCreators({ offset: 0, limit, })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const fetchMore = async () => {
        try {
            if (followings.length >= total_following_count) return;

            const newOffset = offset + limit;
            setOffset(newOffset);

            await dispatch(fetchFollowingCreators({ offset: newOffset, limit, })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const handleUnfollow = async (uuid: string) => {
        try {
            await dispatch(RemoveFollowBondWithCreator({ uuid, })).unwrap()
            enqueueSnackbar("Creator unfollowed successfully", { variant: "success", })

            await resetAndFetch()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Following Creators
            </DialogTitle>

            <DialogContent dividers id="followingScrollableDiv">
                <InfiniteScroll
                    dataLength={followings.length}
                    next={fetchMore}
                    hasMore={followings.length < total_following_count}
                    loader={<Typography>Loading...</Typography>}
                    scrollableTarget="followingScrollableDiv"
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                >
                    <Stack spacing={2}>
                        {followings.map((item: FollowingCreator) => (
                            <Card key={item.uuid} className={styles.card}                            >
                                <CardContent className={styles.cardContent}
                                >
                                    <Box className={styles.header}
                                    >
                                        <Typography variant="h6">
                                            {item.following.name}
                                        </Typography>

                                        <Typography className={styles.role}
                                        >
                                            {item.following.role}
                                        </Typography>
                                    </Box>

                                    <Typography className={styles.email}
                                    >
                                        {item.following.email}
                                    </Typography>

                                    <Box className={styles.footer}
                                    >
                                        <Typography>
                                            UUID:{" "}
                                            {item.following.uuid}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={async () => await handleUnfollow(item.uuid)}
                                        >
                                            Unfollow
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