import { instanceToPlain } from 'class-transformer';

export default function JsonTransformer(...fields: string[]) {
  return function (constructor: Function) {
    constructor.prototype.toJSON = function () {
      return instanceToPlain(this);
    };
  };
}