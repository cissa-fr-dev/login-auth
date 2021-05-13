const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

//Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

//Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '1005536140036-7uc1lj21oag44dd0v9h3u8nlgn7rcjs4.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

app.get('/', (req,res) => {
    res.render('index');
})      

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', (req,res) => {
    let token = req.body.token;

    console.log(token)
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload)
  }
  verify()
  .then(() => {
      res.cookie('session-token', token);
      res.send('success');
  })
  .catch(console.error);
})

app.get('/profile', (req, res) => {
    let user = req.user;
    res.render('profile', {user});
})

app.get('/protectedRoute', (req, res) => {
    res.render('protectedroute.ejs');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})