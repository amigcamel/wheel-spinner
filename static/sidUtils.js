import HSDIC from './data.js';

function genSidInfo(sid, imgHeight = '25px', fontSize = 'inherit') {
  const profile = HSDIC[sid];
  let imgUrl;
  if (profile) {
    if (profile.uri) {
      imgUrl = `https://lh3.googleusercontent.com/a-/${profile.uri}`;
    } else {
      imgUrl = 'https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png' ;
    }
  }
  const name = sid.slice(1,4) + ' ' + HSDIC[sid].name;
  return `<img src="${imgUrl}" style="font-size: 1rem; font-style: inherit; height: ${imgHeight}"> <span style="font-size: ${fontSize}">${name}</span>`;
};

export { genSidInfo };
