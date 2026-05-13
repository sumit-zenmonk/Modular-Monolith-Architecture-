"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Box, Stack, Button, } from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component"
import { enqueueSnackbar } from "notistack"
import { RootState } from "@/redux/store"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import styles from "./creator-listing.modal.module.css"
import { fetchCreators, MakeFollowBondWithCreator, RemoveFollowBondWithCreator } from "@/redux/feature/user/user-action"
import { Creator, FollowingCreator } from "@/redux/feature/user/user-type"

export default function CreatorListingModal({ open, onClose, }: { open: boolean, onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { creators, total_creator_count, followings } = useAppSelector((state: RootState) => state.userReducer);
    const { user } = useAppSelector((state: RootState) => state.authReducer);
    const [offset, setOffset] = useState(0);
    const limit = Number(process.env.page_limit) || 10;

    useEffect(() => {
        if (open) {
            resetAndFetch()
        }
    }, [open])

    const resetAndFetch = async () => {
        try {
            setOffset(0)
            await dispatch(fetchCreators({ offset: 0, limit, })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const fetchMore = async () => {
        try {
            if (creators.length >= total_creator_count) return
            const newOffset = offset + limit
            setOffset(newOffset)

            await dispatch(fetchCreators({ offset: newOffset, limit, })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const handleFollowCreator = async (following_uuid: string) => {
        try {
            await dispatch(MakeFollowBondWithCreator({ following_uuid, follower_uuid: user?.uuid || "" })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    const filteredCreators = creators.filter((creator: Creator) => {
        return !followings.some(
            (following: FollowingCreator) =>
                following.following.uuid === creator.uuid
        )
    })

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Creators</DialogTitle>
            <DialogContent dividers id="creatorScrollableDiv">
                <InfiniteScroll
                    dataLength={creators?.length}
                    next={fetchMore}
                    hasMore={creators?.length < total_creator_count}
                    loader={<Typography>Loading...</Typography>}
                    scrollableTarget="creatorScrollableDiv"
                    endMessage={<Typography style={{ textAlign: "center", }}>Yay! You have seen it all</Typography>}
                >
                    <Stack spacing={2}>
                        {filteredCreators &&
                            filteredCreators.map(
                                (creator: Creator) => (
                                    <Card key={creator.uuid} className={styles.card}>
                                        <CardContent className={styles.cardContent}
                                        >
                                            <Box className={styles.header}
                                            >
                                                <Typography variant="h6">
                                                    {creator.name}
                                                </Typography>

                                                <Typography className={styles.role}
                                                >
                                                    {creator.role}
                                                </Typography>
                                            </Box>

                                            <Typography className={styles.email}
                                            >
                                                {creator.email}
                                            </Typography>

                                            <Box className={styles.footer}
                                            >
                                                <Typography>
                                                    UUID:{" "}{creator.uuid}
                                                </Typography>
                                            </Box>

                                            <Button className={styles.footer} onClick={async () => await handleFollowCreator(creator.uuid)}>
                                                Follow
                                            </Button>
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