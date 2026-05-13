import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/main-server/domain/user/user.entity";
import { UserRepository } from "src/module/main-server/infrastructure/repository/user.repo";

@Injectable()
export class GetCreatorListingService {
    constructor(
        private readonly CreatorRepo: UserRepository,
    ) { }

    async getCreatorListing(user: UserEntity, offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, total } = await this.CreatorRepo.getCreatorListing(user.uuid, curr_offset, curr_limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Creator Listing Success"
        }
    }
}