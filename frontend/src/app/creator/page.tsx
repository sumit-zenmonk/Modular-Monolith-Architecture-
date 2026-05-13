"use client"

import { useState } from "react"
import { useAppSelector } from "@/redux/hooks.ts";
import styles from "./creator.module.css"
import { RootState } from "@/redux/store"
import { Box, Button, Card } from "@mui/material"
import FollowerListingModal from "@/component/creator/follower-listing-modal/follower-listing-modal";
import PostFormModal from "@/component/creator/post-create-modal/post-create-modal";
import CreatorPostListingModal from "@/component/creator/creator-post-listing-modal/creator-post-listing-modal";

export default function CreatorPage() {
  const { user, loading } = useAppSelector((state: RootState) => state.authReducer);
  const [openfollowerModal, setOpenfollowerModal] = useState(false);
  const [openPostFormModal, setOpenPostFormModal] = useState(false);
  const [openCreaterPostListingModal, setOpenCreaterPostListingModal] = useState(false);

  if (loading) {
    return <Box className={styles.container}>Loading...</Box>;
  }

  return (
    <>
      <Box className={styles.container}>
        <Card className={styles.cardWrapper} elevation={3}>
          <Button
            variant="outlined"
            onClick={() => setOpenfollowerModal(true)}
          >
            Open follower
          </Button>

          <Button
            variant="outlined"
            onClick={() => setOpenCreaterPostListingModal(true)}
          >
            Posts
          </Button>

          <Button
            variant="outlined"
            onClick={() => setOpenPostFormModal(true)}
          >
            Create Post
          </Button>
        </Card>
      </Box>

      <FollowerListingModal open={openfollowerModal} onClose={() => setOpenfollowerModal(false)} />
      <CreatorPostListingModal open={openCreaterPostListingModal} onClose={() => setOpenCreaterPostListingModal(false)} />
      <PostFormModal open={openPostFormModal} onClose={() => setOpenPostFormModal(false)} />
    </>
  )
}