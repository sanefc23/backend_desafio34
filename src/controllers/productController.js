const Product = require('../db/Product');
const Message = require('../db/Message');
const logger = require('../services/logger');

const productController = {
    listProducts: (req, res) => {
        logger.info('Productos: ', req.session);
        logger.info(req.route);
        const userName = req.session.passport ? req.session.passport.user : null;
        Product.find().sort({
                '_id': 1
            })
            .then(products => {
                if (products.length) {
                    res.render('index', {
                        userName: userName
                    })
                } else {
                    res.render('index', {
                        ok: false,
                        error: 'No hay products cargados',
                        productos: []
                    })
                }
            })
            .catch(e => {
                loggerErr.error('Error getting products: ', e);
            })
    },
    testView: (req, res) => {
        logger.info(req.route);
        const fakeProds = []

        if (fakeProds.length > 0) {
            return res.render('index', {
                testView: true,
                fakeProds: fakeProds
            })
        } else {
            return res.render('index', {
                testView: true,
                fakeProds: []
            })
        }
    },
    addProduct: (req, res) => {
        logger.info(req.route);
        Product.create(req.body)
            .then(prod => {
                console.log('producto insertado: ', prod);
                res.redirect('/productos')
            })
            .catch(e => {
                loggerErr.error('Error en Insert producto: ', e);
            });
    },
    showEditProduct: (req, res) => {
        logger.info(req.route);
        let currentID = req.params.id;

        Product.findById(currentID)
            .then(prod => {
                console.log(prod);
                res.render('index', {
                    id: prod._id,
                    title: prod.title,
                    thumbnail: prod.thumbnail,
                    price: prod.price,
                    updateForm: true,
                    viewTitle: "Editar producto",
                    errorMessage: "No hay productos."
                })
            })
            .catch(e => {
                logger.error('Error getting product: ', e);
            });
    },
    editProduct: (req, res) => {
        logger.info(req.route);
        let id = req.params._id;
        console.log(req.body);

        Product.findByIdAndUpdate(id, req.body)
            .then(prod => {
                logger.warn('producto actualizado: ', prod);
                res.redirect('/productos');
            })
            .catch(e => {
                logger.error('Error en Update producto: ', e);
            });
    },
    deleteProduct: (req, res) => {
        logger.info(req.route);
        let id = req.params.idprod;
        Product.findByIdAndDelete(id)
            .then(prod => {
                logger.warn('producto eliminado: ', prod);
                res.redirect('/productos');
            })
            .catch(e => {
                logger.error('Error en Delete producto: ', e);
            });
    }
}

module.exports = productController;