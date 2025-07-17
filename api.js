
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://ravneetkaur005rk:4S1qVUiRMxQUHSG1@cluster0.wlrffzr.mongodb.net/UserList?retryWrites=true&w=majority',

{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() =>
{
    console.log('Connected to MongoDB');

    app.listen(port, () => {
        console.log('User List API Server is running on port ' + port );
    })
})

.catch((error) => {
    console.log('Error connectiong to MongoDB: ' +error);

});

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {type:Number, required: true, unique: true},
    email:{type: String, required: true},
    username: {type:String}
});

const User = mongoose.model("User", userSchema);

const router = express.Router();

app.use('/api/users', router);

app.get('/', (req, res) => {
    res.send('Welcome to the User List API!');
  });
  
router.route("/")
    .get((req,res) => {
        console.log("Fetching all Users...");

        User.find()
            .then((users) => res.json(users))

            .catch((err) => res.status(400).json("Error: " +err));
    })

    .post((req,res) => {
        const id = req.body.id;
        const email = req.body.email;
        const username = req.body.username;

        const newUser = new User({
            id,
            email,
            username
        });

        newUser 
            .save()
            .then(() => res.json("New User added!"))
            .catch((err) => res.status(400).json("Error: " +err));
    });
    

router.route("/newuser")
    .get((req, res) => {
        res.send("This is the add User page")
    })
    .post((req,res) =>{
        const id = req.body.id;
        const email = req.body.email;
        const username = req.body.username;


        const newUser = new User({
            id,
            email,
            username
        });

        newUser 
            .save()
            .then(() => res.json("New User added!"))

            .catch((err) => res.status(400).json("Error: " +err));
    });

router.route('/user/:id')
    .get((req, res) => {
        const userId = Number(req.params.id);

        User.find({id: userId})
        .then(user => {res.json(user);})

        .catch((err) => res.status(400).json("Error: " +err));
    });

router.route('/modify/:id')
    .put((req, res) => {
        User.findOne({id:Number(req.params.id)})
        .then((user) => {
            user.username = req.body.username;

            user    
                .save()
                .then(() => res.json("User Updated Successfully!!"))
                .catch((err) => res.status(400).json("Error: " +err));

        })
        .catch((err) => res.status(400).json("Error: " +err));
        
    });



router.route('/delete/:id')
    .delete((req,res) => {
        User.findOneAndDelete({
            id: Number(req.params.id)
        })

        .then(() => res.json ("User Deleted Successfully!!"))
        .catch((err) => res.status(400).json("Error: " +err));
    });