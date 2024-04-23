const crypto = require('crypto');

const fetchPreviousCrashHistory = (async( req, res)=>{
const dataEl = req.body

// const crashHash = "6062e0e87b3c3beff3259d59b067da49551c44e6cf33565b38e929c0c21d212c";
let data = [];
let currenthash = []

const getCurrentHash = ((event)=>{
  const hash = crypto.createHmac("sha256", event).update(dataEl.salt).digest("hex");
  const hex = hash.substring(0, 8);
  const int = parseInt(hex, 16);
  const crashpoint = Math.max(1, (Math.pow(2, 32) / (int + 1)) * (1 - 0.01)).toFixed(3);
  const rounddown = (Math.floor(crashpoint * 100) / 100).toFixed(2);
  let row = { hash: event, crashpoint: rounddown};
  currenthash.push(row)
})

function generateHash(seed) {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

function crashPointFromHash(gameHash) {
  const hash = crypto.createHmac("sha256", gameHash).update(dataEl.salt).digest("hex");
  const hex = hash.substring(0, 8);
  const int = parseInt(hex, 16);
  const crashpoint = Math.max(1, (Math.pow(2, 32) / (int + 1)) * (1 - 0.01)).toFixed(3);
  const rounddown = (Math.floor(crashpoint * 100) / 100).toFixed(2);
  let row = { hash: gameHash, crashpoint: rounddown};
  data.push(row);
}

function getPreviousGames() {
  const previousGames = [];
  let gameHash = generateHash(dataEl.hash);
  for (let i = 0; i < parseInt(dataEl.number); i++) {
    const gameResult = crashPointFromHash(gameHash);
    previousGames.push({ gameHash, gameResult });
    gameHash = generateHash(gameHash);
  }
  return previousGames;
}


setTimeout(()=>{
res.status(200).json([...currenthash, ...data])
}, 1000)

getPreviousGames()
  getCurrentHash(dataEl.hash)
})


const VerifyDice = (async(req, res)=>{
  const data = req.query
  let server_seed = (data.s)
  let client_seed = (data.c)
  let nonce = (server_seed)
  let maxRange = 100
function generateRandomNumber() {
  const combinedSeed = `${server_seed}-${client_seed}-${nonce}`;
  const hmac = crypto.createHmac('sha256', combinedSeed);
  const hmacHex = hmac.digest('hex');
  const decimalValue = (parseInt(hmacHex , 32) % 10001 / 100)
  const randomValue = (decimalValue % maxRange).toFixed(2);
  let result = { point : randomValue, server_seed:server_seed, client_seed:nonce, nonce }
 res.status(200).json({result})
}

generateRandomNumber()

})

module.exports = { fetchPreviousCrashHistory , VerifyDice}