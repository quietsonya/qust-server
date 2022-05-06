import { RoleCategoryPermissionsList } from 'src/roles/types/permissions/category-permissions'
import { RolePermissionsList } from 'src/roles/types/permissions/permissions'
import { RoleTextChannelPermissionsList } from 'src/roles/types/permissions/text-channel-permissions'


export class GroupLayout {
    roleLayouts: RoleLayout[]
    categoryLayouts: CategoryLayout[]
}

class RoleLayout {
    name: string
    permissions?: Partial<RolePermissionsList>
}

class CategoryLayout {
    name: string
    permissionsOfRoles?: CategoryRolePermissionsLayout[]
    channelLayouts: TextChannelLayout[]
}

class TextChannelLayout {
    name: string
    permissionsOfRoles?: TextChannelRolePermissionsLayout[]
}


class CategoryRolePermissionsLayout {
    roleName: string
    permissions: Partial<RoleCategoryPermissionsList>
}
class TextChannelRolePermissionsLayout {
    roleName: string
    permissions: Partial<RoleTextChannelPermissionsList>
}