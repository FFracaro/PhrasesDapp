async function main() 
{
    // Abstração para implantar smart contracts
    // Fábrica para instancias de frases
    const Phrases = await ethers.getContractFactory("Phrases");
 
    // Inicia o processo de implantação
    // returno a promessa que se resolverá em um contrato
    const phrases = await Phrases.deploy("Testando 1, 2 , 3");   
    console.log("Contract deployed to address:", phrases.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });