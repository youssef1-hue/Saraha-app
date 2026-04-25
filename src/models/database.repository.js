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
    const doc = new model(data);
    return await doc.save(options);
};

export const findOneAndUpdate = async ({
    model,
    filter = {},
    update = {},
    options = { new: true },
}) => {
    return await model.findOneAndUpdate(filter, update, options);
};
