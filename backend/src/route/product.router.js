const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const {GetAll, Createproduct, Updateproduct, GetSingle, Deleteproduct, GetAllProduct,CreateproductBa,GetAllProductAll,GetProductID,UpdateproductBa ,UpdateproductStatus} = require('../controller/product.controller');

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, '../public/image');
    cb(null, path.join(__dirname, '../public/image')); // Corrected path

  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

router.get('/all', GetAll);   //// use ing in page warrenty 
router.get('/', GetAllProduct);  //// use ing in page table 
router.get('/product', GetAllProductAll); //// use ing in page viewproduct POS
router.post('/', upload.single('file'), Createproduct);
router.post('/create', upload.single('file'), CreateproductBa);
router.put('/updateproduct/:id', upload.single('file'), UpdateproductBa); //// use ing in page update product
router.put('/updateproduct_status/:id', UpdateproductStatus); //// use ing in page product lsit

router.put('/:id', upload.single('file'), Updateproduct);
router.get('/:id', GetSingle);
router.get('/product/:id', GetProductID); //// using update purchase 
router.delete('/:id', Deleteproduct);

module.exports = router;