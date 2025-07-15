
require('dotenv').config();
const express = require('express');
const TronWeb = require('tronweb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const fullNode = 'https://api.trongrid.io';
const solidityNode = 'https://api.trongrid.io';
const eventServer = 'https://api.trongrid.io';
const privateKey = process.env.PRIVATE_KEY;

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const USDT_CONTRACT = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';

app.post('/send-usdt', async (req, res) => {
  const { to, amount } = req.body;
  if (!to || !amount) return res.status(400).json({ error: 'Eksik parametre' });

  try {
    const contract = await tronWeb.contract().at(USDT_CONTRACT);
    const amountInSun = Number(amount) * 1e6;
    const tx = await contract.transfer(to, amountInSun).send();
    res.json({ tx });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
