import HSDIC from './data.js';

function genSidInfo(sid, imgHeight = '25px', fontSize = 'inherit') {
  const imgUrl = HSDIC[sid].uri ? `https://lh3.googleusercontent.com/a-/${HSDIC[sid].uri}` : 'https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png';
  return `<img src="${imgUrl}" style="font-size: 1rem; font-style: inherit; height: ${imgHeight}"> <span style="font-size: ${fontSize}">${sid.slice(1,4)} ${HSDIC[sid].name.split(' ')[0]}</span>`;
};

export { genSidInfo };
