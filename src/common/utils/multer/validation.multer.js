
export const fileFieldValidation = {
    image: ["image/jpeg", "image/png", "image/gif"],
    video: ["video/mp4", "video/mpeg", "video/quicktime"],

}


export const fileFilter = (validation = []) => {
return function (req, file, cb) {
    if (!validation.includes(file.mimetype)) {
        cb(new Error("Invalid file type" , {cause:{status:400}}), false);
    } else {
        cb(null, true);
    }   
}
}