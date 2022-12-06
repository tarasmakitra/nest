import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from 'src/post/controllers/post.controller';
import { PostService } from 'src/post/services/post.service';
import { Post } from 'src/post/entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { PostCategoryController } from './controllers/postCategory.controller';
import { PostCategory } from './entities/postCategory.entity';
import { PostCategoryService } from './services/postCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory, User]), AuthModule],
  controllers: [PostCategoryController, PostController],
  providers: [PostService, PostCategoryService],
})
export class PostModule {}
