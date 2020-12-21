import HSDIC from './data.js';

function genSidInfo(sid) {
  const imgUrl = HSDIC[sid].uri ? `https://lh3.googleusercontent.com/a-/${HSDIC[sid].uri}` : 'https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png';
  return `<img src="${imgUrl}" style="font-size: 1rem; font-style: inherit; height: 25px"> ${sid.slice(1,4)} ${HSDIC[sid].name.split(' ')[0]}`;
};

export { genSidInfo };
