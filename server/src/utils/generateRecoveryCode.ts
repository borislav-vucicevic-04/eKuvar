const CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789#@$=".split('');


const getRandomNumber = (max: number) => Math.floor(Math.random() * max);

const generateRecoveryCode = (seed?: string) => {
  let code: string[] = []
  let MAX_LENGTH = 16;

  if(seed) {
    code = seed.split('');
    MAX_LENGTH -= seed.length;
  }

  for(let i = 0; i < MAX_LENGTH; i++) {
    const index = getRandomNumber(CHARACTERS.length);
    code.push(CHARACTERS[index]);
  }

  return code.join('');
} 

export default generateRecoveryCode