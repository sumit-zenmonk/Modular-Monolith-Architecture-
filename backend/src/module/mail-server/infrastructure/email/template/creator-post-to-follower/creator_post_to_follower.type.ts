export interface CreatorPostCreatedMailBody {
    type: 'CREATOR_POST_CREATED';
    receiver_name: string;
    creator: {
        uuid: string;
        name: string;
    };
    post: {
        uuid: string;
        title: string;
        excerpt?: string;
    };
}

export interface CreateMailEntryPayload {
    email: string;
    body: CreatorPostCreatedMailBody;
}