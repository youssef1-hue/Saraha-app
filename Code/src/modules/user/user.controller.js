import { Router } from "express";
import { logout, profile, profileCoverImage, profileImage, rotateToken, shareProfile, updatePassword } from "./user.service.js";
import { SuccessResponse } from "../../common/utils/index.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enum.js";
import * as validator from "./user.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { localFileUpload } from "../../common/utils/multer/local.multer.js";
import { fileFieldValidation } from "../../common/utils/multer/validation.multer.js";
const router = Router();


router.post('/logout',
    authentication(),
     async (req, res, next) => {
        const status = await logout(req.user , req.body , req.decoded);
        return SuccessResponse({res , status});
     });

router.patch('/password',
    authentication(),
    validation(validator.updatePassword),
    async (req, res, next) => {
        const credentials = await updatePassword(req.body, req.user, `${req.protocol}://${req.get('host')}`);
        return SuccessResponse(res, "Success", { ...credentials });
    }
);
router.patch('/profile-image',
    authentication(),
    localFileUpload({customPath: 'users/profile' , validation: fileFieldValidation.image} ).single('attachment'),
    validation(validator.profileImage),
    async (req, res, next) => {
        const account = await profileImage(req.user, req.file);
        return SuccessResponse(res, "Success", { account });
    }
);

router.patch('/profile-cover-image',
    authentication(),
    localFileUpload({customPath: 'users/profile/cover' ,
        validation: fileFieldValidation.image,
        maxSize: 5 ,
    } ).array('attachments', 5),
    validation(validator.profileCoverImage),
    async (req, res, next) => {
        const account = await profileCoverImage(req.user, req.files);
        return SuccessResponse(res, "Success", { account });
    }
);

router.get("/",
    authentication(),
     async (req, res, next) => {
    const account = await profile(req.user);
    return SuccessResponse(res, "Success", { account });
});
router.get("/:userId/share-profile",
    validation(validator.shareProfile),
    async (req, res, next) => {
    const account = await shareProfile(req.params.userId);
    return SuccessResponse(res, "Success", { account });
});

router.get('/rotate-token',
    authentication(TokenTypeEnum.REFRESH),
     async (req, res, next) => {
    const credentials = await rotateToken(req.user , req.decoded ,`${req.protocol}://${req.get('host')}`,"issuer");
    return SuccessResponse({res, status:201 , data:{ ...credentials }});
});

export default router;

