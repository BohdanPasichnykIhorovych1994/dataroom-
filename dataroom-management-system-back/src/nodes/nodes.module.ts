import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import {
  DataroomNodeEntity,
  DataroomNodeSchema,
} from './schemas/node.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: DataroomNodeEntity.name, schema: DataroomNodeSchema },
    ]),
  ],
  controllers: [NodesController],
  providers: [NodesService],
})
export class NodesModule {}
