import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { DeletePostService } from "./delete-post.service";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.CREATOR)
@Controller()
export class DeletePostController {
    constructor(private readonly deletePostService: DeletePostService) { }

    @Delete("post/:post_uuid")
    async DeletePost(@Req() req: Request, @Param("post_uuid") post_uuid: string) {
        return this.deletePostService.deletePostService(post_uuid, req.user);
    }
}