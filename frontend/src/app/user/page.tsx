"use client"

import { useState } from "react"
import { useAppSelector } from "@/redux/hooks.ts";
import styles from "./user.module.css"
import { RootState } from "@/redux/store"
import { Box, Button, Card } from "@mui/material"
import CreatorListingModal from "@/component/user/creator-listing-modal/creator-listing.modal";
import FollowingListingModal from "@/component/user/following-listing-modal/following-listing-modal";
import UserPostListingModal from "@/component/user/user-post-listing-modal/user-post-listing-modal";

export default function UserPage() {
  const { user, loading } = useAppSelector((state: RootState) => state.authReducer);
  const [openCreatorsModal, setOpenCreatorsModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openUserFollowingModal, setOpenUserFollowingModal] = useState(false);

  if (loading) {
    return <Box className={styles.container}>Loading...</Box>;
  }

  return (
    <>
      <Box className={styles.container}>
        <Card className={styles.cardWrapper} elevation={3}>
          <Button
            variant="outlined"
            onClick={() => setOpenCreatorsModal(true)}
          >
            Open Creators
          </Button>

          <Button
            variant="outlined"
            onClick={() => setOpenUserFollowingModal(true)}
          >
            Open following Posts
          </Button>

          <Button
            variant="outlined"
            onClick={() => setOpenFollowingModal(true)}
          >
            Open following
          </Button>
        </Card>
      </Box>

      <CreatorListingModal open={openCreatorsModal} onClose={() => setOpenCreatorsModal(false)} />
      <UserPostListingModal open={openUserFollowingModal} onClose={() => setOpenUserFollowingModal(false)} />
      <FollowingListingModal open={openFollowingModal} onClose={() => setOpenFollowingModal(false)} />
    </>
  )
}