import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CreateFollowerOfCreatorDto } from "./create-follower-of-creator.dto";
import { CreateFollowerOfCreatorService } from "./create-follower-of-creator.service";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.USER)
@Controller()
export class CreateFollowerOfCreatorController {
    constructor(private readonly createFollowerOfCreatorService: CreateFollowerOfCreatorService) { }

    @Post('/follow')
    async CreateFollowerOfCreator(@Req() req: Request, @Body() body: CreateFollowerOfCreatorDto) {
        return this.createFollowerOfCreatorService.createFollowerOfCreator(req.user, body);
    }
}