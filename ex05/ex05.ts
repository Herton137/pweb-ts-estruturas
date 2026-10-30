type FormatadorEx05 = (valor: number) => string;

const formatarMoeda: FormatadorEx05 = (valor: number): string => {
  return `R$ ${valor.toFixed(2)}`;
};

function lerPrecos(texto: string): { precos: number[]; ignorados: number } {
  const linhas = texto.split('\n');
  const precos: number[] = [];
  let ignorados = 0;
  let count = 0;

  for (const linha of linhas) {
    const limpa = linha.trim();
    if (limpa === '') {
      continue;
    }
    const normalizada = limpa.replace(',', '.');
    const num = Number(normalizada);

    if (isNaN(num) || num <= 0) {
      ignorados++;
      continue;
    }

    if (count >= 20) {
      continue; // Limite máximo de 20 itens
    }

    precos.push(num);
    count++;
  }

  return { precos, ignorados };
}

function somarItens(...precos: number[]): number {
  return precos.reduce((acumulador, atual) => acumulador + atual, 0);
}

// Sobrecarga da função calcularDesconto
function calcularDesconto(total: number, percentual: number): number;
function calcularDesconto(total: number, cupom: string): number;
function calcularDesconto(total: number, arg: number | string): number {
  if (typeof arg === 'number') {
    return (total * arg) / 100;
  } else {
    const cupomUpper = arg.trim().toUpperCase();
    switch (cupomUpper) {
      case 'BEMVINDO':
        return (total * 10) / 100;
      case 'PROMO20':
        return (total * 20) / 100;
      case 'MENOS15':
        return total >= 100 ? 15 : 0;
      default:
        return 0;
    }
  }
}

const campoItens = document.getElementById('itens') as HTMLTextAreaElement;
const campoCupom = document.getElementById('cupom') as HTMLInputElement;
const campoFidelidade = document.getElementById('fidelidade') as HTMLInputElement;
const botaoFechar = document.getElementById('fechar') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

botaoFechar.addEventListener('click', () => {
  const textoItens = campoItens.value;
  const cupomTexto = campoCupom.value.trim();
  const ehFidelidade = campoFidelidade.checked;

  const { precos, ignorados } = lerPrecos(textoItens);

  if (precos.length === 0) {
    saida.textContent = 'Nenhum item válido';
    saida.className = 'erro';
    return;
  }

  const subtotal = somarItens(...precos);
  let descontoCupom = 0;
  let mensagemCupom = '';

  if (cupomTexto !== '') {
    const cupomUpper = cupomTexto.toUpperCase();
    if (cupomUpper === 'BEMVINDO' || cupomUpper === 'PROMO20' || cupomUpper === 'MENOS15') {
      descontoCupom = calcularDesconto(subtotal, cupomTexto);
      if (cupomUpper === 'MENOS15' && subtotal < 100) {
        descontoCupom = 0;
        mensagemCupom = 'Cupom inválido ou não aplicável';
      } else {
        mensagemCupom = `Cupom ${cupomUpper}: - ${formatarMoeda(descontoCupom)}`;
      }
    } else {
      mensagemCupom = 'Cupom inválido ou não aplicável';
    }
  }

  const subtotalComCupom = Math.max(0, subtotal - descontoCupom);
  let descontoFidelidade = 0;
  if (ehFidelidade) {
    descontoFidelidade = calcularDesconto(subtotalComCupom, 5);
  }

  const totalFinal = Math.max(0, subtotalComCupom - descontoFidelidade);

  let itensInfo = `Itens: ${precos.length}`;
  if (ignorados > 0) {
    itensInfo += ` (${ignorados} ${ignorados === 1 ? 'linha ignorada' : 'linhas ignoradas'})`;
  }

  let linhasResultado = `${itensInfo}
Subtotal: ${formatarMoeda(subtotal)}`;

  if (cupomTexto !== '') {
    linhasResultado += `\n${mensagemCupom}`;
  }
  if (ehFidelidade) {
    linhasResultado += `\nFidelidade (5%): - ${formatarMoeda(descontoFidelidade)}`;
  }
  linhasResultado += `\nTotal a pagar: ${formatarMoeda(totalFinal)}`;

  saida.textContent = linhasResultado;
  saida.className = 'sucesso';
});