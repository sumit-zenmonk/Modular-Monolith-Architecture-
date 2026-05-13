import { createSlice } from "@reduxjs/toolkit"
import { CreatorState } from "./user-type"
import { createPost, deletePost, fetchCreators, fetchFollowers, fetchFollowingCreators, fetchCreatorPosts, MakeFollowBondWithCreator, fetchFollowingCreatorsPosts } from "./user-action"

const initialState: CreatorState = {
    creators: [],
    followings: [],
    followers: [],
    posts: [],
    following_creators_posts: [],
    total_following_posts_count: 0,
    total_follower_count: 0,
    total_creator_count: 0,
    total_following_count: 0,
    total_post_count: 0,
    loading: false,
    error: null,
    status: "pending",
}

const creatorSlice = createSlice({
    name: "creator",
    initialState,
    reducers: {
        resetCreatorState: (state) => {
            state.creators = []
            state.followings = []
            state.followers = []
            state.posts = []
            state.following_creators_posts = []
            state.total_following_posts_count = 0
            state.total_follower_count = 0
            state.total_creator_count = 0
            state.total_following_count = 0
            state.total_post_count = 0
            state.loading = false
            state.error = null
            state.status = "pending"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreators.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchCreators.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const newCreators = action.payload.creators

                if (action.meta.arg.offset === 0) {
                    state.creators = newCreators
                } else {
                    const merged = [...state.creators, ...newCreators]

                    state.creators = Array.from(
                        new Map(
                            merged.map((creator) => [
                                creator.uuid,
                                creator,
                            ])
                        ).values()
                    )
                }

                state.total_creator_count = action.payload.total_creator_count
                state.error = null
            })
            .addCase(fetchCreators.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchFollowingCreators.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchFollowingCreators.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const newFollowings = action.payload.followings

                if (action.meta.arg.offset === 0) {
                    state.followings = newFollowings
                } else {
                    const merged = [...state.followings, ...newFollowings,]

                    state.followings = Array.from(
                        new Map(
                            merged.map((item) => [
                                item.uuid,
                                item,
                            ])
                        ).values()
                    )
                }

                state.total_following_count = action.payload.total_following_count
                state.error = null
            })
            .addCase(fetchFollowingCreators.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(MakeFollowBondWithCreator.fulfilled, (state, action) => {
                const following_uuid = action.meta.arg.following_uuid;
                state.creators = state.creators.filter((creator) => creator.uuid !== following_uuid);
            })
            .addCase(fetchFollowers.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const newFollowers = action.payload.followers

                if (action.meta.arg.offset === 0) {
                    state.followers = newFollowers
                } else {
                    const merged = [...state.followers, ...newFollowers,]

                    state.followers = Array.from(
                        new Map(
                            merged.map((item) => [
                                item.uuid,
                                item,
                            ])
                        ).values()
                    )
                }

                state.total_follower_count = action.payload.total_follower_count
                state.error = null
            })
            .addCase(fetchFollowers.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchCreatorPosts.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchCreatorPosts.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const newPosts = action.payload.posts

                if (action.meta.arg.offset === 0) {
                    state.posts = newPosts
                } else {
                    const merged = [...state.posts, ...newPosts]

                    state.posts = Array.from(
                        new Map(
                            merged.map((post) => [
                                post.uuid,
                                post,
                            ])
                        ).values()
                    )
                }

                state.total_post_count = action.payload.total_post_count
                state.error = null
            })
            .addCase(fetchCreatorPosts.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(createPost.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.posts = [action.payload, ...state.posts,]
                state.total_post_count += 1
                state.error = null
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.posts = state.posts.filter((post) => post.uuid !== action.payload.uuid)
                state.total_post_count -= 1
                state.error = null
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchFollowingCreatorsPosts.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchFollowingCreatorsPosts.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const newPosts = action.payload.following_creators_posts

                if (action.meta.arg.offset === 0) {
                    state.following_creators_posts = newPosts
                } else {
                    const merged = [...state.following_creators_posts, ...newPosts,]

                    state.following_creators_posts = Array.from(
                        new Map(
                            merged.map((post) => [
                                post.uuid,
                                post,
                            ])
                        ).values()
                    )
                }

                state.total_following_posts_count = action.payload.total_following_posts_count
                state.error = null
            })
            .addCase(fetchFollowingCreatorsPosts.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
    },
})

export const { resetCreatorState } = creatorSlice.actions

export default creatorSlice.reducer