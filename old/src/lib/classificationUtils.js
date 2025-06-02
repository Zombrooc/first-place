function ordinalize(n) {
  if (n === 1) return '1ª';
  if (n === 2) return '2ª';
  if (n === 3) return '3ª';
  return `${n}ª`;
}

function expandirClassificacao(valor) {
  const limpo = valor.trim();
  if (isNaN(parseInt(limpo[0]))) return [limpo];

  if (limpo.includes(',')) {
    return limpo.split(',').map(x => x.trim());
  }

  if (limpo.includes('-')) {
    const [inicio, fim] = limpo.split('-').map(x => parseInt(x.trim()));
    const resultado = [];
    for (let i = inicio; i <= fim; i++) resultado.push(String(i));
    return resultado;
  }

  return [limpo];
}

function expandCategory(categoriaBruta) {
  if (!categoriaBruta.includes('|')) {
    return categoriaBruta.split('/').map(c => c.trim());
  }

  const blocos = categoriaBruta.split('|').map(bloco =>
    bloco.split('/').map(sub => sub.trim())
  );

  return produtoCartesiano(blocos).map(combinacao =>
    combinacao.join(' ')
  );
}

function produtoCartesiano(arrays) {
  return arrays.reduce((acc, curr) => {
    const resultado = [];
    acc.forEach(a => {
      curr.forEach(b => {
        resultado.push([...a, b]);
      });
    });
    return resultado;
  }, [[]]);
}

function generateClassificationText(valor, nomeclatura) {
  if (isNaN(parseInt(valor))) return valor;
  return `${ordinalize(parseInt(valor))} ${nomeclatura}`;
}

function gerarClassificacoes(linha) {
  const classificacoes = expandirClassificacao(linha['Classificação']);
  const categorias = expandCategory(linha['Categoria']);
  const nomeclatura = linha['Nomeclatura'] || '';
  const quantidade = parseInt(linha['Quantidade para Cada'] || '1');

  const resultados = [];

  classificacoes.forEach(clf => {
    const baseText = generateClassificationText(clf, nomeclatura);
    categorias.forEach(cat => {
      const completo = `${baseText} - ${cat}`;
      for (let i = 0; i < quantidade; i++) {
        resultados.push(completo);
      }
    });
  });

  return resultados;
}

module.exports = {
  gerarClassificacoes
};
