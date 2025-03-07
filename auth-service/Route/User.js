const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const User = require('../Model/UserModel')
const {verifyToken} = require('../Middleware/Auth')

router.post('/register', async (req, res) => {
  const {id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({message: 'Un utilisateur avec cet email existe déjà'});
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 2);
    const newUser = new User({ id: id, name: name, email: email, password: hashedPassword});
    const user = await newUser.save();

    res.status(201).json({success: true});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({message: 'email ou mot de passe incorrect', "status": 401});
    }

    const passwordCheck = await bcrypt.compare(mdp, user.password);
    if (!passwordCheck) {
      return res.status(401).json({ message: "email ou mot de passe incorrect" });
    }

    const Token = {user: {id: user.id, email: user.email}}
    
    res.status(200).json({token: generateToken(Token)});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.get("/profile", verifyToken, (req, res)=>{
    try {
        res.status(200).json(req.user.user);
      } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
      }

})

module.exports = router;