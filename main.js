function nod(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function modInverse(e, phi) {
  let [m0, m, x0, x1] = [phi, e, 0, 1];
  while (m > 1) {
    const q = Math.floor(m / phi);
    [m, phi] = [phi, m % phi];
    [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < 0 ? x1 + m0 : x1;
}

function generateKeys() {
  const p = parseInt(pInput.value);
  const q = parseInt(qInput.value);

  if (p === q || !isPrime(p) || !isPrime(q)) {
    alert('p и q должны быть различными простыми числами.');
    return;
  }

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  let e = 2;
  while (e < phi) {
    if (nod(e, phi) === 1) break;
    e++;
  }

  const d = modInverse(e, phi);

  publicKeyOutput.textContent = `n: ${n}, e: ${e}`;
  privateKeyOutput.textContent = `d: ${d}`;

  return { n, e, d };
}

function encryptText() {
  const text = textInput.value;
  const { n, e } = generateKeys();

  const encryptedBlocks = [];
  const textNumber = textToNumber(text);

  for (let i = 0; i < textNumber.length; i += n.toString().length - 1) {
    const block = textNumber.slice(i, i + n.toString().length - 1);
    const encryptedBlock = modExp(BigInt(block), BigInt(e), BigInt(n));
    encryptedBlocks.push(encryptedBlock.toString());
  }

  encryptedOutput.textContent = encryptedBlocks.join(', ');
}

function decryptText() {
  const signature = signatureInput.value;
  const { n, d } = generateKeys();

  const decryptedBlocks = [];
  const signatureBlocks = signature.split(',');

  for (const block of signatureBlocks) {
    const decryptedBlock = modExp(BigInt(block), BigInt(d), BigInt(n));
    decryptedBlocks.push(decryptedBlock.toString());
  }

  const decryptedNumber = decryptedBlocks.join('');
  const decryptedText = numberToText(decryptedNumber);

  decryptedOutput.textContent = decryptedText;
}

function modExp(base, exp, mod) {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function textToNumber(text) {
  const textBytes = new TextEncoder().encode(text);
  let number = '';
  for (let byte of textBytes) {
    number += byte.toString().padStart(3, '0');
  }
  return number;
}

function numberToText(number) {
  const byteArray = [];
  for (let i = 0; i < number.length; i += 3) {
    const byte = parseInt(number.slice(i, i + 3), 10);
    byteArray.push(byte);
  }
  return new TextDecoder().decode(new Uint8Array(byteArray));
}

const pInput = document.getElementById('p');
const qInput = document.getElementById('q');
const publicKeyOutput = document.getElementById('public-key');
const privateKeyOutput = document.getElementById('private-key');
const textInput = document.getElementById('text');
const encryptedOutput = document.getElementById('encrypted');
const signatureInput = document.getElementById('signature');
const decryptedOutput = document.getElementById('decrypted');


document.getElementById('generate-keys').addEventListener('click', generateKeys);
document.getElementById('encryptText').addEventListener('click', encryptText);
document.getElementById('decryptText').addEventListener('click', decryptText);