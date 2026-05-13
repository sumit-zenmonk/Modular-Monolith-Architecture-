import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreatePostModule } from "./create-post/create-post.module";
import { DeletePostModule } from "./delete-post/delete-post.module";
import { GetCreatorPostListingModule } from "./get-creator-post-listing/get-creator-post-listing.module";
import { GetUserPostListingModule } from "./get-user-post-listing/get-user-post-listing.module";

@Module({
    imports: [
        CreatePostModule,
        DeletePostModule,
        GetCreatorPostListingModule,
        GetUserPostListingModule,
        RouterModule.register([
            {
                path: 'creator',
                children: [
                    { path: '/', module: CreatePostModule },
                    { path: '/', module: DeletePostModule },
                    { path: '/', module: GetCreatorPostListingModule },
                ],
            },
            {
                path: 'user',
                children: [
                    { path: '/follow', module: GetUserPostListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})

export class PostModule { }