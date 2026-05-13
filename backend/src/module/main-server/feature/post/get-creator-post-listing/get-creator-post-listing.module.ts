import { Module } from "@nestjs/common";
import { GetCreatorPostListingService } from "./get-creator-post-listing.service";
import { GetCreatorPostListingController } from "./get-creator-post-listing.controller";
import { PostRepository } from "src/module/main-server/infrastructure/repository/post.repo";

@Module({
    imports: [],
    controllers: [GetCreatorPostListingController],
    providers: [GetCreatorPostListingService, PostRepository],
    exports: [],
})

export class GetCreatorPostListingModule { }