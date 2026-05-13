import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CreatePostService } from "./create-post.service";
import { CreatePostDto } from "./create-post.dto";
import { RolesGuard } from "src/module/main-server/infrastructure/guard/user/user.role.guard";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";
import { Roles } from "src/module/main-server/infrastructure/guard/user/user.role.decorator";

@UseGuards(RolesGuard)
@Roles(UserRoleEnum.CREATOR)
@Controller()
export class CreatePostController {
    constructor(private readonly createPostService: CreatePostService) { }

    @Post('/post')
    async CreatePost(@Req() req: Request, @Body() body: CreatePostDto) {
        return this.createPostService.createPost(req.user, body);
    }
}