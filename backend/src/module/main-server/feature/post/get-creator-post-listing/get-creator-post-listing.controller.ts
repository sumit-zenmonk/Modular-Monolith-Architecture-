import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetCreatorPostListingService } from "./get-creator-post-listing.service";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.CREATOR)
@Controller()
export class GetCreatorPostListingController {
    constructor(private readonly getCreatorPostListingService: GetCreatorPostListingService) { }

    @Get('/post')
    async GetCreatorPostListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.getCreatorPostListingService.getCreatorPostListingService(req.user, offset, limit);
    }
}