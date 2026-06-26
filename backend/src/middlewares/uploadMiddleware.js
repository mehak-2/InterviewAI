import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
        const error = new Error("Only PDF resume uploads are allowed");
        error.statusCode = 400;
        return cb(error);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;
