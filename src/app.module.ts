import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { SeedService } from './common/services/seed.service';
import { DatabaseModule } from 'src/database/database.module';
import { PageModule } from 'src/page/page.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      // cache: true,
      envFilePath: ['.env'], // [ '.env.local', '.env' ] TODO do we need multiple envs?
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PageModule,
    PostModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
    ]),
    RouterModule.register([
      {
        path: 'users',
        module: UserModule,
      },
    ]),
    RouterModule.register([
      {
        path: 'pages',
        module: PageModule,
      },
    ]),
    RouterModule.register([
      {
        path: 'posts',
        module: PostModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [SeedService],
})
export class AppModule {}
