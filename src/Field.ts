export function Field() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor._fields) {
      target.constructor._fields = [];
    }
    target.constructor._fields.push(propertyKey);
  };
}
