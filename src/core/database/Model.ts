export class Model {
  public static async all(where?: Record<string, any>) {
    //@ts-ignore
    return await prisma[this.prototype.modelName.toLowerCase()].findMany(
      where
        ? {
            [Object.keys(where).join("_")]:
              Object.keys(where).length > 1
                ? Object.assign(
                    {},
                    ...Object.keys(where).map((key) => ({ [key]: where[key] }))
                  )
                : where[Object.keys(where)[0]],
          }
        : null
    );
  }

  public static async find(where: Record<string, any>) {
    //@ts-ignore
    return await prisma[this.prototype.modelName.toLowerCase()].findOne({
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
  }

  public async delete() {
    const primary = [];

    //@ts-ignore
    for (const [key, val] of this.constructor.columns) {
      if (val.primary) primary.push(key);
    }

    //@ts-ignore
    return await prisma[this.modelName.toLowerCase()].delete({
      where: {
        [primary.join("_")]:
          primary.length > 1
            ? Object.assign({}, ...primary.map((key) => ({ [key]: this[key] })))
            : this[primary[0]],
      },
    });
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
          `returned null on key ${key} on table ${this.modelName.toLowerCase()}`
        );

      if (val.primary) primary.push(key);

      data[key] = v;
    }

    //@ts-ignore
    await prisma[this.modelName.toLowerCase()].upsert({
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
}
