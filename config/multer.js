import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "public", "images", "uploads");
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            if (err) return cb(err);
            const fn = name.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

const upload = multer({ storage });

export default upload;
