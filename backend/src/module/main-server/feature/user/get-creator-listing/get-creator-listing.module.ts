import { Module } from "@nestjs/common";
import { GetCreatorListingService } from "./get-creator-listing.service";
import { GetCreatorListingController } from "./get-creator-listing.controller";
import { UserRepository } from "src/module/main-server/infrastructure/repository/user.repo";

@Module({
    imports: [],
    controllers: [GetCreatorListingController],
    providers: [UserRepository, GetCreatorListingService],
    exports: [],
})

export class GetCreatorListingModule { }