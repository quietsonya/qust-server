import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { StandardGroupLayouts } from 'src/layouts/types/standard-group-layouts'
import { CreateGroupDto } from './dto/create-group.dto'
import { LayoutsService } from '../layouts/layouts.service'
import { Group } from './models/groups.model'
import { GroupUser } from './models/group-user.model'
import { Includeable } from 'sequelize/types'
import { DeleteGroupDto } from './dto/delete-group.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InternalGroupsCudEvent } from './events/internal-groups.CUD.event'
import { UserIdAndGroupIdDto } from 'src/permissions/dto/user-id-and-group-id.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { InternalGroupUsersCudEvent } from './events/internal-group-users.CUD.event'


@Injectable()
export class GroupsService {

    constructor(
        private eventEmitter: EventEmitter2,
        private layoutsService: LayoutsService,
        @InjectModel(Group) private groupRepository: typeof Group,
        @InjectModel(GroupUser) private groupUserRepository: typeof GroupUser,
    ) {}

    async getGroupById(groupId: string, include?: Includeable | Includeable[]): Promise<Group> {
        return await this.groupRepository.findByPk(groupId, { include })
    }

    async getGroupsIdsByUserId(userId: string): Promise<string[]> {
        return (await this.groupUserRepository.findAll({ where: { userId } })).map(row => row.groupId)
    }

    async isUserGroupParticipant({ userId, groupId }: UserIdAndGroupIdDto): Promise<boolean> {
        return !!await this.groupUserRepository.findOne({ where: { userId, groupId } })
    }

    async addUserToGroup(dto: UserIdAndGroupIdDto): Promise<GroupUser> {
        const groupUserRow: GroupUser = await this.groupUserRepository.create(dto)
        this.eventEmitter.emit(
            'internal-group-users.created',
            new InternalGroupUsersCudEvent({
                groupId: groupUserRow.groupId,
                usersIds: [ groupUserRow.userId ],
                action: 'create'
            })
        )
        return groupUserRow
    }

    async removeUserFromGroup(dto: UserIdAndGroupIdDto): Promise<GroupUser> {
        const groupUserRow: GroupUser = await this.groupUserRepository.findOne({ where: { ...dto } })
        if (!groupUserRow)
            throw new NotFoundException({ message: 'User is not a group participant' })
        await groupUserRow.destroy()
        this.eventEmitter.emit(
            'internal-group-users.deleted',
            new InternalGroupUsersCudEvent({
                groupId: groupUserRow.groupId,
                usersIds: [ groupUserRow.userId ],
                action: 'delete'
            })
        )
        return groupUserRow
    }

    async createGroup(dto: CreateGroupDto): Promise<Group> {
        const group: Group = await this.groupRepository.create(dto)
        await this.layoutsService.createBlacklistRolesCategoriesAndTextChannelsByLayout({
            groupId: group.id,
            groupLayout: StandardGroupLayouts[dto.layout] || StandardGroupLayouts.DEFAULT
        })
        this.eventEmitter.emit(
            'internal-groups.created',
            new InternalGroupsCudEvent({
                group,
                action: 'create'
            })
        )
        return group
    }

    async updateGroup({ group, name }: UpdateGroupDto): Promise<Group> {
        group.name = name
        await group.save()
        this.eventEmitter.emit(
            'internal-groups.updated',
            new InternalGroupsCudEvent({ group, action: 'update' })
        )
        this.eventEmitter.emit(
            'internal-groups.updated',
            new InternalGroupsCudEvent({
                group,
                action: 'update'
            })
        )
        return group
    }

    async deleteGroup({ group }: DeleteGroupDto): Promise<Group> {
        await group.destroy()
        this.eventEmitter.emit(
            'internal-groups.deleted',
            new InternalGroupsCudEvent({ group, action: 'delete' })
        )
        this.eventEmitter.emit(
            'internal-groups.deleted',
            new InternalGroupsCudEvent({
                group,
                action: 'delete'
            })
        )
        return group
    }

}