import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { Role } from 'src/roles/models/roles.model'

export class PermissionsByRolesInTextChannelDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Role)
        roles: Role[]

    @IsUUID()
        textChannelId: string

}