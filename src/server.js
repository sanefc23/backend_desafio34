const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const {
    engine
} = require("express-handlebars");
const routerAPI = express.Router();
const PATH = require('path')
const app = express();
const io = require("socket.io")(server);
const denv = require('dotenv');
const dotenv = denv.config();
const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")
const passport = require('passport');
const flash = require('connect-flash');
const compression = require('compression');
const args = require('minimist')(process.argv);
const PORT = process.env.PORT || args[2];
const log4js = require('log4js');
const {
    fork
} = require("child_process");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const cors = require('cors')

// --- MongoDB Models ---
const Message = require("./db/Message");
const Product = require("./db/Product");
const {
    faker
} = require('@faker-js/faker');

log4js.configure({
    appenders: {
        warnings: {
            type: "file",
            filename: "warn.log",
            level: 'warn'
        },
        all: {
            type: "console"
        },
    },
    categories: {
        file1: {
            appenders: ["warnings"],
            level: "warn"
        },
        default: {
            appenders: ["all"],
            level: "trace"
        }
    }
});

const logger = log4js.getLogger();
const loggerWarn = log4js.getLogger('file1');

// --- Normalizr ---
const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

const author = new schema.Entity('authors', {}, {
    idAttribute: 'email'
})
const text = new schema.Entity('texts', {
    author: author
}, {
    idAttribute: '_id'
})

// middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("./public"));
app.use(cookieParser());
app.use(flash());
app.use(compression());
app.use(cors())

const server = require("http").createServer(app);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
server.on("error", (error) => console.log("Server Error\n\t", error));
console.log(`Worker ${process.pid} started`)

// --- Session ---
const sessionOptions = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_ATLAS_URL
    }),
    secret: 's3cr3t0',
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: 60 * 1000
    }
}

app.use(session(sessionOptions));

// --- PASSPORT ---
app.use(passport.initialize());
app.use(passport.session());
app.use(function (err, req, res, next) {
    console.log(err);
});

// Routers
app.use("/", routerAPI);
app.use("/productos", productRouter);
app.use("/user", userRouter);

app.get('/', (req, res) => {
    res.redirect('/productos')
});

app.get('/info', (req, res) => {
    logger.info(req.route);
    res.json({
        argsEntrada: process.argv,
        sistOperativo: process.platform,
        nodeVersion: process.version,
        reservedMemory: process.memoryUsage().rss,
        executionPath: process.cwd(),
        processId: process.pid,
        cores: numCPUs,
        //carpetacorriente??
    })
})

app.get('/randoms/:num?', (req, res) => {
    logger.info(req.route);
    const cantidad = parseInt(req.params.num) || 100000000;
    const computo = fork("./computo.js");
    computo.send(cantidad);
    computo.on("message", (sum) => res.send(sum));
})

app.use(function (req, res) {
    loggerWarn.warn('404 - NOT FOUND')
    res.sendStatus(404)
});

// handlebars engine
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: PATH.resolve() + "/views",
        partialsDir: PATH.resolve() + "/views/partials",
    })
);

app.set("views", "views");
app.set("view engine", "hbs");

//Mongoose
connect()

function connect() {
    mongoose.connect(process.env.MONGO_ATLAS_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 1000
        })
        .then(() => console.log('Conectado a la base de datos...'))
        .catch(error => console.log('Error al conectarse a la base de datos', error));
}

io.on('connection', (socket) => {
    //funcion para leer todos los mensajes de la db y mostrarlos.
    function selectAllMessages() {
        Message.find().sort({
                'date': -1
            })
            .then(messages => {
                const parsedMessages = messages.map(function (m) {
                    return {
                        _id: m._id.toString(),
                        author: {
                            email: m.author.email,
                            name: m.author.name,
                            lastName: m.author.lastName,
                            age: m.author.age,
                            alias: m.author.alias,
                            avatar: m.author.avatar
                        },
                        text: m.text,
                        timeStamp: m.timeStamp
                    };
                })
                const normalizedMsgs = normalize(parsedMessages, [text]);
                console.log('Longitud antes de normalizar:', JSON.stringify(messages).length);
                console.log('Longitud después de normalizar:', JSON.stringify(normalizedMsgs).length);
                socket.emit('messages', {
                    messages: messages,
                    normalizedMsgs: normalizedMsgs,
                });
            })
            .catch(e => {
                console.log('Error getting messages: ', e);
            });
    }

    //funcion para leer todos los productos de la db y mostrarlos.
    function selectAllProducts() {
        Product.find().sort({
                '_id': 1
            })
            .then(products => {
                socket.emit('productCatalog', {
                    products: products,
                    errorMessage: "No hay productos"
                });
            })
            .catch(e => {
                console.log('Error getting products: ', e);
            });
    }

    //Llamo a las funciones para que se muestren los mensajes y productos al levantar el servidor.
    selectAllMessages();
    selectAllProducts();

    //Inserto un nuevo mensaje en la base de datos de mensajes.
    socket.on('newMsg', newMsg => {
        Product.create(newMsg)
            .then(() => {
                console.log('Mensaje insertado');
                selectAllMessages();
                return false;
            })
            .catch(e => {
                console.log('Error en Insert message: ', e);
            });
    });
});