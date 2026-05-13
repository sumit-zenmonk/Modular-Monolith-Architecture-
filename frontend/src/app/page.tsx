"use client"

import { useAppSelector } from "@/redux/hooks.ts";
import styles from "./home.module.css"
import { RootState } from "@/redux/store"
import { Box, Button, Card, } from "@mui/material"

export default function Home() {
  const { user, loading } = useAppSelector((state: RootState) => state.authReducer);

  if (loading) {
    return <Box className={styles.container}>Loading...</Box>;
  }

  return (
    <Box className={styles.container}>
      <Card className={styles.cardWrapper} elevation={3}>
        <Button
          variant="contained"
          className={styles.logoutBtn}
        >
          {user?.name}
          {user?.email}
          {user?.role}
        </Button>
      </Card>
    </Box>
  )
}