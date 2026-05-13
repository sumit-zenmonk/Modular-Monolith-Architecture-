import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetUserPostListingService } from "./get-user-post-listing.service";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.USER)
@Controller()
export class GetUserPostListingController {
    constructor(private readonly getUserPostListingService: GetUserPostListingService) { }

    @Get('/post')
    async GetUserPostListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.getUserPostListingService.getUserPostListingService(req.user, offset, limit);
    }
}