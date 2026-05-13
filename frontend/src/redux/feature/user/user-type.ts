import { UserRoleEnum } from "@/enums/user.enum"

export interface Creator {
    uuid: string
    name: string
    email: string
    role: UserRoleEnum
}

export interface FollowingCreator {
    uuid: string
    following: Creator
    created_at: string
}

export interface FollowerCreator {
    uuid: string
    follower: Creator
    created_at: string
}

export interface Post {
    uuid: string
    title: string
    content: string
    user_uuid: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Follow {
    uuid: string
    follower_uuid: string
    following_uuid: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FollowingCreatorPost {
    uuid: string
    title: string
    content: string
    user_uuid: string
    user: {
        name: string
        email: string
        followers: Follow[]
        created_at: string
        updated_at: string
        deleted_at: string | null
    }
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface CreatorState {
    creators: Creator[]
    followings: FollowingCreator[]
    followers: FollowerCreator[]
    posts: Post[]
    following_creators_posts: FollowingCreatorPost[]
    total_following_posts_count: number
    total_follower_count: number
    total_creator_count: number
    total_following_count: number
    total_post_count: number
    loading: boolean
    error: string | null
    status: "pending" | "succeed" | "rejected"
}