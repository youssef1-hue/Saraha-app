export const findOne = async ({
    model,
    filter = {},
    select = '',
    options = {},
}) => {
    const doc = options.lean
        ? await model.findOne(filter).select(select).lean()
        : await model.findOne(filter).select(select);

    return doc;
}


export const create = async ({
    model,
    data = [{}],
    options = { validateBeforeSave: true },
}) => {
    return await model.create(data, options);
}

export const createOne = async ({
    model,
    data = {},
    options = {},
}) => {
    return await model.create(data, options);
};