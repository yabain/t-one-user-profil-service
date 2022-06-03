import express,{ Request, Response } from 'express'
import { MicroServiceApp } from './bussiness/service-app';
import { InjectorContainer } from './core/utils';

const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const timeout = require("connect-timeout")
const router = express.Router()

app.use(timeout("120s"))
app.use(cors())
app.use(bodyParser.urlencoded({limit:'50mb', extended:true}))
app.use(bodyParser.json({limit:'50mb'}))
app.use(router)
app.use(express.json())

app.get('/',(request:Request,response:Response)=> {
    console.log("get")
    response.send('User Profil Application works!');
})
var port = process.env.PORT || 3000;

let startApp = InjectorContainer.getInstance().getInstanceOf<MicroServiceApp>(MicroServiceApp);
startApp.start()
app.get("/",(request:Request,response:Response)=>{
    response.status(200).json({
        message:"Micro service application start"
    })
})
app.listen(port, () => {
    console.log(`Application started on port ${port}!`);
  });