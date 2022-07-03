const express = require('express');
const productRouter = express.Router();
const productController = require("../controllers/productController");

// Ruta base para uso de HANDLEBARS
productRouter.get('/', productController.listProducts);

productRouter.get('/vista-test/:cant?', productController.testView);

productRouter.post('/agregar', productController.addProduct);

productRouter.get('/editar/:id', productController.showEditProduct);

productRouter.put('/editar/:_id', productController.editProduct);

productRouter.delete('/borrar/:idprod', productController.deleteProduct);

module.exports = productRouter;