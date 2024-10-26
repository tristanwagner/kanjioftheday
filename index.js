const { kanji } = require('./kanji.json');
const { promises } = require('fs');

const header = '<h1 align="center">Kanji of the day</h1>';

let output = '';
const add = (input) => {
  output += input;
  output += '\n';
}

const getKanji = () => {
  const now = new Date();
  const start = new Date(2000, 0 , 1);
  const diff = Math.floor((now - start) / 1000 * 60 * 60 * 24);

  return kanji[diff % kanji.length];
}

const fetchKanji = async () => {
  let data;

  // it's possible that meanings is empty
  // and we don't want that
  while (!data?.meanings?.length) {
    data = await fetch(`https://kanjiapi.dev/v1/kanji/${getKanji()}`)
      .then((r) => r.json());
  }

  return data;
}

(async () => {
  let data = await fetchKanji()

  add(header);
  add(`<h1 align="center">${data.kanji}</h1>`);
  add(`<p align="left">meaning(s): ${data.meanings.join(', ')}</p>`);

  if (data.heisig_en) {
    add(`<p align="left">Heisig: <b>${data.heisig_en}</b></p>`);
  }

  if (data.on_readings?.length) {
    add(`<p align="left">ON reading(s): <b>${data.on_readings.join(', ')}</b></p>`);
  }

  if (data.kun_readings?.length) {
    add(`<p align="left">KUN reading(s): <b>${data.kun_readings.join(', ')}</b></p>`);
  }

  if (data.name_readings?.length) {
    add(`<p align="left">name reading(s): <b>${data.name_readings.join(', ')}</b></p>`);
  }

  if (data.freq_mainichi_shinbun) {
    add(`<p align="left">frequency: <b>${data.freq_mainichi_shinbun}</b></p>`);
  }

  if (data.grade) {
    add(`<p align="left">grade: <b>${data.grade}</b></p>`);
  }

  if (data.jlpt) {
    add(`<p align="left">JLPT level: <b>${data.jlpt}</b></p>`);
  }

  add(`<p align="left">stroke count: <b>${data.stroke_count}</b></p>`);
  add(`<p align="left">unicode: <b>${data.unicode}</b></p>`);
  add(`<p align="left"><img src="https://komarev.com/ghpvc/?username=tristanwagner-kanjioftheday&label=Views&color=0e75b6&style=flat" alt="views"/></p>`)

  await promises.writeFile("README.md", output);
})();

