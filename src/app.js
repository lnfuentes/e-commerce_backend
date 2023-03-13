import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import loginRouter from './routes/login.routes.js';
import signupRouter from './routes/signup.routes.js';
import profileRouter from './routes/profile.routes.js'
import { engine } from 'express-handlebars';
import viewRoutes from './routes/view.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.SERV_PORT || 8080;
const userMongo = process.env.USER_MONGO;
const passMongo = process.env.PASS_MONGO;
const dbMongo = process.env.DB_MONGO;
const stringCollection =`mongodb+srv://${userMongo}:${passMongo}@coder-cluster.ncl2vhs.mongodb.net/${dbMongo}?retryWrites=true&w=majority`;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/cart', cartRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);
app.use('/', viewRoutes);

app.set('view engine', 'ejs');
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})

server.on('error', error => console.log(`Error en el servidor: ${error}`));

const environment = async () => {
    try {
        await mongoose.connect(stringCollection, error => {
            console.log("Conectado a la base de datos");
        })
    } catch (error) {
        console.log(`Error en la conexion de la base de datos ${error}`)
    }
}

const okStartData = () => {
    if(userMongo && passMongo) return true;
    else return false;
}
okStartData() && environment();