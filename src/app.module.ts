import { appConfig } from '@config';
import { Algorithm } from '@interfaces';
import { ErrorFilter, JwtAuthGuard, ResultInterceptor } from '@middlewares';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loggerInstance } from '@plugins';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mysqlOptions } from './datasources';
import { AuthService, JwtStrategy, MysqlModule } from './models';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PassportModule,
    JwtModule.register({
      secret: appConfig.jwt.secret,
      signOptions: {
        algorithm: appConfig.jwt.algorithm as Algorithm,
        expiresIn: appConfig.jwt.expiresIn,
      },
    }),
    TypeOrmModule.forRoot(mysqlOptions),
    MysqlModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
    AuthService,
    JwtStrategy,
    {
      provide: 'logger',
      useValue: loggerInstance,
    },
  ],
  exports: [AuthService],
})
export class AppModule {
  static jwtToken: string;
  constructor(private authService: AuthService) {
    AppModule.jwtToken = this.authService.sign({ name: 'hxy' });
  }
}
