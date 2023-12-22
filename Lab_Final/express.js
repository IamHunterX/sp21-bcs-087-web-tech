const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');
const session = require('express-session');
app.use(session({ secret: "Secret!" }));
const transactionAPI = 'http://localhost:4000/transactions';

// ... rest of your code

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongoString = 'mongodb+srv://admin:123@coinverse.guonfyd.mongodb.net/?retryWrites=true&w=majority';
// const mongoString = 'mongodb+srv://<username>:<password>@coinverse.guonfyd.mongodb.net/?retryWrites=true&w=majority'


// Connection URL
mongoose
    .connect(mongoString)
    .then(() => {
        
        console.log('Database Connected');
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        // Redirect to login page if the user is not logged in
        return res.redirect('/signin');
    }
    next();
    };
    
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(transactionAPI);
        const transactions = response.data;
        console.log()
        res.render('home', { transactions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/signup', (req, res) => {
    res.render('signup');
});


app.get('/signin', (req, res) => {
    res.render('/');
});

app.get('/receive', (req, res) => {
    res.render('send');
});
const authenticatedUser = require("./middlewares/authauthenication")
app.get('/send',authenticatedUser, (req, res) => {
    res.render('send');
});
app.get('/logout', (req, res) => {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect('/');
});
app.get('/pay', authenticatedUser,(req, res) => {
    res.render('pay');
});



app.get('/calculator',(req,res)=>{
    // Retrieve the previous calculation results from the session, or initialize an empty array
    const results = req.session.results || [];
    res.render("calculator",{layout: './null_layout',results, user: req.session.user});
  });
  
app.post('/calculator',(req,res)=>{
    
    // Destructure operands and operation from the request body
    const operand1 = req.body.operand1;
    const operation = req.body.operation;
    const operand2 = req.body.operand2;
  
    // Perform the calculation based on the selected operation
    let result;
    switch (operation) {
        case 'add':
            result = parseFloat(operand1) + parseFloat(operand2);
            break;
        case 'subtract':
            result = parseFloat(operand1) - parseFloat(operand2);
            break;
        case 'multiply':
            result = parseFloat(operand1) * parseFloat(operand2);
            break;
        case 'divide':
            result = parseFloat(operand1) / parseFloat(operand2);
            break;
        default:
            result = 'Invalid operation';
    }
  
     // Store the details of the current calculation in an object
    const calculation = { operand1, operand2, operation, result };
  
    if (!req.session.results) {
      req.session.results = [];
    }
    
    req.session.results.push(calculation);
    // Redirect back to the calculator page
    res.redirect('/calculator');
  
 })



app.use(express.json())
app.use(express.static('public'));
const transactionsRouter = require('./routes/transactions');
app.use('/transactions', transactionsRouter);
const userRegistrationRouter = require('./routes/registration');
app.use('/registration', userRegistrationRouter);




app.listen(4000)