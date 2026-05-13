import { Module } from "@nestjs/common";
import { GetFollowingListingController } from "./get-following-listing.controller";
import { GetFollowingListingService } from "./get-following-listing.service";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";

@Module({
    imports: [],
    controllers: [GetFollowingListingController],
    providers: [GetFollowingListingService, FollowRepository],
    exports: [],
})

export class GetFollowingListingModule { }