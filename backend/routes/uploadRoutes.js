import path from 'path';
import express from 'express';
import multer from 'multer';

const uploadRoutes = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
    const filetype = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase()
  const mimetype = file.mimetype;

  if (filetype.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Images only'), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

uploadRoutes.post('/', (req, res) => {
  uploadSingleImage(req, res, (err) => {
      if (err) {
        console.log(err);
        
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).json({
        message: 'Image uploaded successfully',
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).json({
        message: 'NO image file provided',
      });
    }
  });
});

export default uploadRoutes;
