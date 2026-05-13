import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/main-server/domain/user/user.entity";
import { PostRepository } from "src/module/main-server/infrastructure/repository/post.repo";

@Injectable()
export class DeletePostService {
    constructor(
        private readonly postRepo: PostRepository
    ) { }

    async deletePostService(post_uuid: string, user: UserEntity) {
        const isFollowBondExists = await this.postRepo.findByUuid(post_uuid);
        if (!isFollowBondExists) {
            throw new BadRequestException("Post not found");
        }

        await this.postRepo.deletePost(post_uuid);
        return {
            message: "Post deleted successfully"
        };
    }
}