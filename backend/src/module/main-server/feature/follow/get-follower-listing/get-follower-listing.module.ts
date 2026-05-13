import { Module } from "@nestjs/common";
import { GetFollowerListingController } from "./get-follower-listing.controller";
import { GetFollowerListingService } from "./get-follower-listing.service";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";

@Module({
    imports: [],
    controllers: [GetFollowerListingController],
    providers: [GetFollowerListingService, FollowRepository],
    exports: [],
})

export class GetFollowerListingModule { }