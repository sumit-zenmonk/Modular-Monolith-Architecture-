import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetFollowerListingService } from "./get-follower-listing.service";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.CREATOR)
@Controller()
export class GetFollowerListingController {
    constructor(private readonly getFollowerListingService: GetFollowerListingService) { }

    @Get('/follow')
    async GetFollowerListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.getFollowerListingService.GetFollowerListing(req.user, offset, limit);
    }
}