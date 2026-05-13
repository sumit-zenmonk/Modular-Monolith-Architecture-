import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetCreatorListingService } from "./get-creator-listing.service";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.USER)
@Controller()
export class GetCreatorListingController {
    constructor(private readonly getCreatorListingService: GetCreatorListingService) { }

    @Get('/creator')
    async getCreatorListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.getCreatorListingService.getCreatorListing(req.user, offset, limit);
    }
}