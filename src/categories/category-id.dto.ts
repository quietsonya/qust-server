import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CategoryIdDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        categoryId: string

}