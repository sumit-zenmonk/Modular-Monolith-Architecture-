import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetCreatorListingModule } from "./get-creator-listing/get-creator-listing.module";

@Module({
    imports: [
        GetCreatorListingModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: GetCreatorListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }