# question

## question list

- nest 如何不使用 dto 去验证一个单独的 param 参数，例如：`@Param('id', new ParseIntPipe()) id: number`，验证 id 是必填的

## solved question list

- swagger 中 query 使用 object 类型，还必须要在对象值中再定义一次字段值，例如：`where`是个 object，值应该是`{"where": {}}`
- swagger 只显示部分 dto，也就是只显示 `@Body` 的 dto，至于 `@Query` 和 `@Param` 是无法显示的，需要额外显示请使用 `@ApiExtraModels(YourDto)`，公共的 dto 可以直接在 app.controller.ts 使用
- ts 中引入 json 必须添加两个配置
  ```json
  "resolveJsonModule": true,
  "esModuleInterop": true,
  ```
- swagger 加入 auth button，需要`main.ts`的 config 使用`addBearerAuth`，并且 controller 必须要加`@ApiBearerAuth`
- class-validator

  - 可以使用 ValidationPipe，也可以自定义使用 Pipe 中间件
  - 注意 query 和 param 的值都会以字符串形式传输，需要根据字段类型使用 Pipe 进行 parse，特别是数字类型的 id，如果不 parse 无法找到正确的 entity

- prisma 连接数据库，模型定义，migrations，以及基础 crud 方法包(orm/odm)
  - 不可以写字段和表格注释，后续可能会提供 ❌
  - 不可以回退迁移，因为官方认为回退迁移是危险的操作，会删除数据，推荐使用新的 migration 或者手动修改 db❌
  - prisma.schema 提示并不完全，方法参数没有提示，含义注释也没有 ❌
  - @updatedAt 不是作用于数据库，而是在使用 prisma 更新方法时会给该字段插入一个时间，修改了 prisma.schema 后必须应用迁移才可以对 prismaClient 生效 ❓
  - DateTime 默认 UTC 时区，并且无法读取或设置时区，查看数据库时间值需要 +8:00 才是正常时间，prisma 客户端返回的时间是正常时间 ❌
  - 因为 prisma 默认使用 env，但是.env 最好只配置 DATABASE_URL，其他配置放在 config，但多环境多个.env 使用 prisma 很麻烦 ❓
  ```json
  // npm package.json script
  {
    "migrate:g": "npx prisma migrate dev --name migrate --create-only --preview-feature",
    "migrate:s": "npx prisma migrate dev --name migrate --preview-feature",
    "migrate:d": "npx prisma migrate deploy --preview-feature",
    "migrate:reset": "npx prisma migrate reset --preview-feature",
    "migrate:status": "npx prisma migrate status --preview-feature",
    "migrate:resolve": "npx prisma migrate resolve --preview-feature"
  }
  ```
  ```bash
  # 查看命令帮助
  $ npx prisma migrate -h
  # 开发环境创建迁移
  $ npx prisma migrate dev --create-only --preview-feature
  # 开发环境创建迁移并应用迁移
  $ npx prisma migrate dev --preview-feature
  # 非开发环境应用迁移
  $ npx prisma migrate deploy --preview-feature
  # 查看迁移状态
  $ npx prisma migrate status --preview-feature
  # 修复迁移问题
  $ npx prisma migrate resolve --preview-feature
  # 重置数据库并应用所有迁移，会清除所有数据
  $ npx prisma migrate rest --preview-feature
  ```
- typeorm
  - 多数据库@Model 引入`TypeOrmModule.forFeature`功能，第二个参数需要设置数据库连接名称，否则无法找到；如果要使用 `@InjectRepository`，同样第二个参数需要设置数据库连接名称
  - `TypeOrmModule.forFeature` 是作用于模块内的，所以 datasource 必须在模块内 `@InjectDatasource` 再传给 repository.ts(放弃，比较麻烦，每一个 module 都要创建一个 repository.ts)
  - 使用同一个 MysqlCustomRepository，然后使用 useValue provider 将 entity inject 其中，然后使用 `private recordRepository: MysqlCustomRepository<Record>` 即可正常使用 repository
  - 注意使用 provider，参数必须要不是都通过 inject 方式注入，要不就是参数都有默认，最后提供必须不用手动传参数才能正常提供
  - 使用 migrate 提示报错`No changes in database schema were found - cannot generate a migration. To create a new empty migration use "typeorm migration:create" command`
    - 一般此报错都是配置不对，`entities` 没有指定正确的位置或者其他配置不对
    - 因为 nest 中有`autoLoadEntities`自动加载实体的选项，所以如果只配了该选项也是无法完成 migrate 的，所以 `entities` 也需要配置
- swagger
  - npm 包：`@nestjs/swagger` + `@nestjs/serve-static`
  - `@nestjs/serve-static` 是静态文件设置，在 app.module.ts 设置 index.html
  - nest 的一些 dto 不显示，并且 dto 重复显示字段
  - class-validator 的注解，nest 无法读取，必须要设置`@ApiProperty`或者`@ApiPropertyOptional`，而且无法解析复杂的类型，复杂类型需要设置`@ApiProperty({type: 'array' | 'object'})` 或者`@ApiProperty({type: [String]})`

## to-do list

- 自定义复合型注解 -- 将重复注解进行解耦，一般是用于 controller 和 dto
- 新建 shared 文件夹作为唯一单例文件注入使用
- 应用通用中间件
- mock server
- unit test 示例书写

## done list

- 设置别名 -- nest 已经封装好了别名设置，直接在 tsconfig.json 中设置，不需要考虑编译别名的问题
- 本想采用 prisma，但因为问题过多，后采用 typeorm -- npm 包：`@nestjs/typeorm` + `typeorm`
- unit test - nest 已定义好 spec.ts
- token 中间件 -- guard 守卫
- 引入 jwt -- `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt`
- 结果和报错做统一处理 -- filter 负责错误，interceptor 负责结果包装
- 参数验证 -- pipe + `class-validator`
- 基础模板 crud，以及事务处理 -- typeorm repository
- 可以访问 openapi.json，用来生成 sdk
- 后端 sdk -- 使用@openapitools/openapi-generator-cli
- logger 虽然有内置的工具，但是高级功能没有，还是选择 winston
