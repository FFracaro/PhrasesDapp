require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/Phrases.sol/Phrases.json");
const contractAddress = "0x5fc4D719C2EE05Fd45a3E3EaA06A1A4a6cB5587b";
const phrasesContract = new web3.eth.Contract(contract.abi, contractAddress);

async function updateMessage(newMessage)
{
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
    const gasEstimate = await phrasesContract.methods.update(newMessage).estimateGas(); // estimando o gas

    // Criando a transação
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': gasEstimate, 
      'maxFeePerGas': 1000000108,
      'data': phrasesContract.methods.update(newMessage).encodeABI()
    };

    // Assinando a transação
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

    signPromise.then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) 
      {
        if (!err) 
        {
          console.log("O hash da sua transação é: ", hash, "");
        } 
        else 
        {
          console.log("Ocorreu um erro:", err)
        }
      });
    }).catch((err) => {
      console.log("Erro na promessa:", err);
    });

}

async function main() 
{
    const message = await phrasesContract.methods.message().call();
    console.log("A mensagem é: " + message);
    //await updateMessage("Modificado.");
}
main();