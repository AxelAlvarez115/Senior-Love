import multer from 'multer';
import path from 'path';

const imageFilter = (req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format non supporté. Utilisez JPG, PNG ou WebP.'), false);
    }
};

const avatarStorage = multer.diskStorage({
    destination: 'public/uploads/avatars/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${req.session.userId}-${Date.now()}${ext}`);
    },
});

const photoStorage = multer.diskStorage({
    destination: 'public/uploads/gallery/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `photo-${req.session.userId}-${Date.now()}${ext}`);
    },
});

export const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter,
}).single('avatar');

export const photoUpload = multer({
    storage: photoStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter,
}).single('photo');
