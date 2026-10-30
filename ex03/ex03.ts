function calcularTotal(valor: number, parcelas: number): number {
  if (parcelas <= 3) {
    return valor;
  }
  return valor * (1.02 ** parcelas);
}

function simularParcelamento(preco: number, entrada?: number): string {
  let financiado = preco;

  if (typeof entrada !== 'undefined') {
    if (entrada >= preco) {
      return '<tr><td colspan="4">A entrada cobre o valor total. Não há parcelas.</td></tr>';
    }
    financiado = preco - entrada;
  }

  let html = '';
  for (let i = 1; i <= 12; i++) {
    // Pula parcelamento de 7, 8, 9 e 11 vezes
    if (i === 7 || i === 8 || i === 9 || i === 11) {
      continue;
    }

    const total = calcularTotal(financiado, i);
    const valorParcela = total / i;

    // Encerra a simulação se a parcela for menor que R$ 50,00
    if (valorParcela < 50) {
      break;
    }

    const jurosStr = i <= 3 ? 'sem juros' : '2% a.m.';
    html += `<tr>
      <td>${i}x</td>
      <td>R$ ${valorParcela.toFixed(2)}</td>
      <td>R$ ${total.toFixed(2)}</td>
      <td>${jurosStr}</td>
    </tr>`;
  }

  return html;
}

const campoPreco = document.getElementById('preco') as HTMLInputElement;
const campoEntrada = document.getElementById('entrada') as HTMLInputElement;
const botaoSimular = document.getElementById('simular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;
const corpoTabela = document.getElementById('parcelas') as HTMLTableSectionElement;

botaoSimular.addEventListener('click', () => {
  const preco = campoPreco.valueAsNumber;
  const entradaStr = campoEntrada.value;

  if (isNaN(preco) || preco <= 0) {
    saida.textContent = 'Informe um preço válido.';
    saida.className = 'erro';
    corpoTabela.innerHTML = '';
    return;
  }

  let resultadoHtml = '';
  if (entradaStr.trim() === '') {
    resultadoHtml = simularParcelamento(preco);
  } else {
    const entrada = Number(entradaStr);
    resultadoHtml = simularParcelamento(preco, entrada);
  }

  corpoTabela.innerHTML = resultadoHtml;
  saida.textContent = `Simulação realizada para o preço R$ ${preco.toFixed(2)}`;
  saida.className = 'sucesso';
});