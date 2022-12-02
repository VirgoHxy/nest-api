/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  // 指定的校验类型
  userMetaType: any;
  // 验证组
  groups: string[];
  // true 则跳过验证对象中未定义和null的的字段验证
  skipMissingProperties: boolean;
  // true 则非dto的属性报错
  whitelist: boolean;
  forbidNonWhitelisted: boolean;

  constructor(
    groups?: string[],
    userMetaType?: any,
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
  ) {
    this.groups = groups;
    this.userMetaType = userMetaType;
    this.skipMissingProperties = skipMissingProperties;
    this.whitelist = whitelist;
    this.forbidNonWhitelisted = forbidNonWhitelisted;
  }

  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (!this.userMetaType && (!metatype || !this.toValidate(metatype))) {
      return value;
    }
    const obj = plainToInstance(this.userMetaType || metatype, value);
    if (type === 'query' || type === 'param') {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          if (typeof element === 'string') {
            try {
              obj[key] = JSON.parse(element);
            } catch {}
          }
        }
      }
    }

    try {
      const validatorOptions: ValidatorOptions = {
        skipMissingProperties: this.skipMissingProperties,
        whitelist: this.whitelist,
        forbidNonWhitelisted: this.forbidNonWhitelisted,
        groups: this.groups,
      };
      let errors: ValidationError[] = [];
      const errorsArr: any[] = [[]];
      if (Array.isArray(obj)) {
        for (const iterator of obj) {
          if (JSON.stringify(this.groups) == JSON.stringify(['upsert'])) {
            if (iterator.id != null) {
              validatorOptions.groups = ['findById'];
            } else {
              validatorOptions.groups = ['create'];
            }
          }
          const temp = await validate(iterator, validatorOptions);
          if (temp.length > 0) errorsArr[0].push(temp);
        }
      } else {
        errors = await validate(obj, validatorOptions);
      }
      if (errors.length > 0 || errorsArr[0].length > 0) {
        const temp = errors.length > 0 ? errors : errorsArr;
        const message = temp.map(this.getAllNestedErrors).join(', ');
        throw new Error(message);
      }
      return obj;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getAllNestedErrors = (error: ValidationError | ValidationError[][]): string[] | string | undefined => {
    if (error instanceof Array) {
      const constraints = [];
      const children = [];
      error.forEach((eleError: ValidationError[], index: number) => {
        if (eleError[0].constraints) {
          constraints.push(Object.values(eleError[0].constraints).map((temp) => `${index}: ${temp}`));
        }
        children.push(eleError[0].children);
      });
      if (constraints.length > 0) {
        return Object.values(constraints);
      }
      return children?.map(this.getAllNestedErrors).join(',');
    } else {
      if (error.constraints) {
        return Object.values(error.constraints);
      }
      return error.children?.map(this.getAllNestedErrors).join(',');
    }
  };
}
