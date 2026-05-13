import { faker } from '@faker-js/faker';
import { mainDataSource, options } from './data-source';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { UserEntity } from '../../domain/user/user.entity';
import { UserRoleEnum } from '../../domain/user/user.enum';

// hardcoded creators for all microservices
const creators = [
    {
        id: 1,
        uuid: 'c0a80101-7b1d-4a9f-8c1a-123456789001',
        email: 'creator1@gmail.com',
        name: 'Creator 1',
    },
    {
        id: 2,
        uuid: 'c0a80102-7b1d-4a9f-8c1a-123456789002',
        email: 'creator2@gmail.com',
        name: 'Creator 2',
    },
    {
        id: 3,
        uuid: 'c0a80103-7b1d-4a9f-8c1a-123456789003',
        email: 'creator3@gmail.com',
        name: 'Creator 3',
    },
    {
        id: 4,
        uuid: 'c0a80104-7b1d-4a9f-8c1a-123456789004',
        email: 'creator4@gmail.com',
        name: 'Creator 4',
    },
    {
        id: 5,
        uuid: 'c0a80105-7b1d-4a9f-8c1a-123456789005',
        email: 'creator5@gmail.com',
        name: 'Creator 5',
    },
    {
        id: 6,
        uuid: 'c0a80106-7b1d-4a9f-8c1a-123456789006',
        email: 'creator6@gmail.com',
        name: 'Creator 6',
    },
    {
        id: 7,
        uuid: 'c0a80107-7b1d-4a9f-8c1a-123456789007',
        email: 'creator7@gmail.com',
        name: 'Creator 7',
    },
    {
        id: 8,
        uuid: 'c0a80108-7b1d-4a9f-8c1a-123456789008',
        email: 'creator8@gmail.com',
        name: 'Creator 8',
    },
    {
        id: 9,
        uuid: 'c0a80109-7b1d-4a9f-8c1a-123456789009',
        email: 'creator9@gmail.com',
        name: 'Creator 9',
    },
    {
        id: 10,
        uuid: 'c0a80110-7b1d-4a9f-8c1a-123456789010',
        email: 'creator10@gmail.com',
        name: 'Creator 10',
    },
    {
        id: 11,
        uuid: 'c0a80111-7b1d-4a9f-8c1a-123456789011',
        email: 'creator11@gmail.com',
        name: 'Creator 11',
    },
    {
        id: 12,
        uuid: 'c0a80112-7b1d-4a9f-8c1a-123456789012',
        email: 'creator12@gmail.com',
        name: 'Creator 12',
    },
    {
        id: 13,
        uuid: 'c0a80113-7b1d-4a9f-8c1a-123456789013',
        email: 'creator13@gmail.com',
        name: 'Creator 13',
    },
    {
        id: 14,
        uuid: 'c0a80114-7b1d-4a9f-8c1a-123456789014',
        email: 'creator14@gmail.com',
        name: 'Creator 14',
    },
    {
        id: 15,
        uuid: 'c0a80115-7b1d-4a9f-8c1a-123456789015',
        email: 'creator15@gmail.com',
        name: 'Creator 15',
    },
];

async function create() {
    mainDataSource.setOptions({
        ...options,
    });

    await mainDataSource.initialize();

    const bcryptService = new BcryptService();
    const hashedPassword = await bcryptService.hashPassword("123");

    const queryRunner = mainDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        // use same creators across all services
        for (const creator of creators) {
            const user = await queryRunner.manager.save(UserEntity, {
                id: creator.id,
                uuid: creator.uuid,
                email: creator.email,// faker.internet.email(),
                password: hashedPassword,
                name: creator.name,// faker.person.fullName(),
                role: UserRoleEnum.CREATOR
            });

            console.log(user);
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();