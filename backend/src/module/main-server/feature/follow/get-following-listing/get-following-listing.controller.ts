import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetFollowingListingService } from "./get-following-listing.service";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.USER)
@Controller()
export class GetFollowingListingController {
    constructor(private readonly getFollowingListingService: GetFollowingListingService) { }

    @Get('/follow')
    async GetFollowingListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.getFollowingListingService.GetFollowingListing(req.user, offset, limit);
    }
}