import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Save to temp; controller moves to user subfolder after parsing req.body
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tmpDir = 'uploads/temp';
        fs.mkdirSync(tmpDir, { recursive: true });
        cb(null, tmpDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `listing-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only jpg, jpeg, png, and webp images are allowed'), false);
    }
};

export default multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
