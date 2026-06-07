import { Role } from '../../common/enums/roles.enum';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: Role;
}
