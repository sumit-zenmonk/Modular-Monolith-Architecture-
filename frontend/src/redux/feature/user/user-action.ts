"use client"

import { RootState } from "@/redux/store"
import { createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL

export const fetchCreators = createAsyncThunk<
    any,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "user/creator/fetch",
    async (
        { limit = Number(process.env.page_limit) || 10, offset = Number(process.env.page_offset) || 0 },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/user/creator?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            return {
                creators: data.data,
                total_creator_count: data.totalDocuments,
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchFollowingCreators = createAsyncThunk<
    any,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "user/creator/following",
    async (
        {
            limit = Number(process.env.page_limit) || 10,
            offset = Number(process.env.page_offset) || 0,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/user/creator/follow?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                }
            )

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            return {
                followings: data.data,
                total_following_count: data.totalDocuments,
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const MakeFollowBondWithCreator = createAsyncThunk<
    any,
    { follower_uuid: string; following_uuid: string },
    { state: RootState }
>(
    "user/creator/follow/bond/create",
    async (
        { follower_uuid, following_uuid },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/user/creator/follow`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    follower_uuid,
                    following_uuid,
                }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            return data
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const RemoveFollowBondWithCreator = createAsyncThunk<
    any,
    { uuid: string },
    { state: RootState }
>(
    "user/creator/follow/bond/delete",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/user/creator/follow/${uuid}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            )

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            return data
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchFollowers = createAsyncThunk<
    any,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "creator/user/followers",
    async (
        { limit = Number(process.env.page_limit) || 10, offset = Number(process.env.page_offset) || 0, },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/creator/user/follow?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                followers: data.data,
                total_follower_count: data.totalDocuments,
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchCreatorPosts = createAsyncThunk<
    any,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "creator/post/fetch",
    async (
        {
            limit = Number(process.env.page_limit) || 10,
            offset = Number(process.env.page_offset) || 0,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/creator/post?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                }
            )

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            return {
                posts: data.data,
                total_post_count: data.totalDocuments,
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const createPost = createAsyncThunk<
    any,
    { title: string; content: string },
    { state: RootState }
>(
    "creator/post/create",
    async ({ title, content }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/creator/post`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            return data.post
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const deletePost = createAsyncThunk<
    any,
    { uuid: string },
    { state: RootState }
>(
    "creator/post/delete",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/creator/post/${uuid}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: token,
                    },
                }
            )

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            return {
                uuid,
                message: data.message,
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchFollowingCreatorsPosts = createAsyncThunk<
    any,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "user/follow/post/fetch",
    async (
        { limit = Number(process.env.page_limit) || 10, offset = Number(process.env.page_offset) || 0, },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/user/follow/post?offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                following_creators_posts: data.data,
                total_following_posts_count: data.totalDocuments,
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)