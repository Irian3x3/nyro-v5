export class Model {
  public static get table() {
    return this.name.toLowerCase();
  }

  public async save() {
    const data = {};
    const primary = [];

    //@ts-ignore
    for (const [key, val] of this.constructor.columns) {
      const v = this[key];

      if (!val.nullable && v === null)
        throw new TypeError(
          //@ts-ignore
          `returned null on key ${key} on table ${this.constructor.table}`
        );

      if (val.primary) primary.push(key);

      data[key] = v;
    }

    //@ts-ignore
    await prisma[this.constructor.table.toLowerCase()].upsert({
      where: {
        [primary.join("_")]:
          primary.length > 1
            ? Object.assign({}, ...primary.map((key) => ({ [key]: data[key] })))
            : data[primary[0]],
      },
      update: data,
      create: data,
    });

    return this;
  }

  public async delete() {
    const primary = [];
    //@ts-ignore
    for (const [key, val] of this.constructor.columns) {
      if (val.primary) primary.push(key);
    }

    //@ts-ignore
    return await prisma[this.constructor.table].delete({
      where: {
        [primary.join("_")]:
          primary.length > 1
            ? Object.assign({}, ...primary.map((key) => ({ [key]: this[key] })))
            : this[primary[0]],
      },
    });
  }

  public json() {
    const data = {};

    //@ts-ignore
    for (const key of this.constructor.columns.keys()) data[key] = this[key];

    return data;
  }

  public static async all() {
    const all = await prisma[this.table].findMany();
    return all.map((data) => this.toClass(data));
  }

  public static async find(where: Record<string, any> = {}) {
    const data = await prisma[this.table].findOne({
      where: {
        [Object.keys(where).join("_")]:
          Object.keys(where).length > 1
            ? Object.assign(
                {},
                ...Object.keys(where).map((key) => ({ [key]: where[key] }))
              )
            : where[Object.keys(where)[0]],
      },
    });

    if (!data) return null;

    return this.toClass(data);
  }

  public static toClass(object: any) {
    const model = new this();

    for (const key in object) {
      //@ts-ignore
      const column = this.columns.get(key);

      if (!model[key] && column.defaults) model[key] = column.defaults;

      model[key] = object[key];
    }

    return model;
  }
}
