type Formatador = (valor: number) => string;

const formatarReal: Formatador = (valor: number): string => {
  return `R$ ${valor.toFixed(2)}`;
};

const formatarMeses = (meses: number): string => {
  const anos = Math.floor(meses / 12);
  const mRestantes = meses % 12;
  const partes: string[] = [];

  if (anos > 0) {
    partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
  }
  if (mRestantes > 0 || anos === 0) {
    partes.push(`${mRestantes} ${mRestantes === 1 ? 'mês' : 'meses'}`);
  }

  return partes.join(' e ');
};

function calcularMeses(meta: number, deposito: number, taxa: number = 0.5): { meses: number; saldo: number; depositado: number } {
  let saldo = 0;
  let meses = 0;
  let depositado = 0;

  while (saldo < meta && meses < 600) {
    meses++;
    saldo = saldo * (1 + taxa / 100);
    
    let depositoMes = deposito;
    if (meses % 12 === 0) {
      depositoMes = deposito * 2; // Em dezembro entra o dobro (13º salário)
    }

    saldo += depositoMes;
    depositado += depositoMes;
  }

  return { meses, saldo, depositado };
}

function exibirValor(rotulo: string, valor: number, formatar: Formatador): string {
  return `${rotulo}: ${formatar(valor)}`;
}

const campoMeta = document.getElementById('meta') as HTMLInputElement;
const campoDeposito = document.getElementById('deposito') as HTMLInputElement;
const campoTaxa = document.getElementById('taxa') as HTMLInputElement;
const botaoCalcular = document.getElementById('calcular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

botaoCalcular.addEventListener('click', () => {
  const meta = campoMeta.valueAsNumber;
  const deposito = campoDeposito.valueAsNumber;
  const taxaStr = campoTaxa.value;

  if (isNaN(meta) || isNaN(deposito) || meta <= 0 || deposito <= 0) {
    saida.textContent = 'Informe valores positivos';
    saida.className = 'erro';
    return;
  }

  const taxa = taxaStr.trim() === '' ? 0.5 : Number(taxaStr);
  const resultado = calcularMeses(meta, deposito, taxa);
  const rendimento = resultado.saldo - resultado.depositado;

  if (resultado.meses >= 600 && resultado.saldo < meta) {
    saida.textContent = `Meta inalcançável em 50 anos. Saldo após 600 meses: ${formatarReal(resultado.saldo)}`;
    saida.className = 'erro';
  } else {
    const tempoFormatado = formatarMeses(resultado.meses);
    saida.textContent = `Você atinge a meta em ${resultado.meses} meses (${tempoFormatado}).
${exibirValor('Saldo final', resultado.saldo, formatarReal)}
${exibirValor('Total depositado', resultado.depositado, formatarReal)}
${exibirValor('Rendimento', rendimento, formatarReal)}`;
    saida.className = 'sucesso';
  }
});