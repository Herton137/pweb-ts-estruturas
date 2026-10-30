type TipoCliente = 'residencial' | 'rural' | 'comercial' | 'industrial';
type Bandeira = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2';

function tarifaPorKwh(tipo: TipoCliente): number {
  switch (tipo) {
    case 'residencial':
    case 'rural':
      return 0.80;
    case 'comercial':
    case 'industrial':
      return 0.95;
  }
}

function adicionalBandeira(consumo: number, bandeira: Bandeira = 'verde'): number {
  let adicionalKwh = 0;
  switch (bandeira) {
    case 'verde':
      adicionalKwh = 0;
      break;
    case 'amarela':
      adicionalKwh = 0.02;
      break;
    case 'vermelha1':
      adicionalKwh = 0.04;
      break;
    case 'vermelha2':
      adicionalKwh = 0.08;
      break;
  }
  return consumo * adicionalKwh;
}

function mensagemBandeira(bandeira: Bandeira): string {
  switch (bandeira) {
    case 'verde':
      return 'Condições favoráveis de geração de energia.';
    case 'amarela':
      return 'Condições de geração menos favoráveis.';
    case 'vermelha1':
    case 'vermelha2':
      return 'Condições mais caras de geração. Economize!';
    default:
      return '';
  }
}

// Teste do parâmetro padrão solicitado (Tarefa 8):
// Chamar adicionalBandeira(100) sem o segundo argumento assume o valor padrão 'verde',
// resultando em R$ 0.00, pois o adicional da bandeira verde é zero.
console.log("Teste parâmetro padrão (100 kWh, bandeira default):", adicionalBandeira(100));

const campoConsumo = document.getElementById('consumo') as HTMLInputElement;
const campoTipo = document.getElementById('tipo') as HTMLSelectElement;
const campoBandeira = document.getElementById('bandeira') as HTMLSelectElement;
const botaoCalcular = document.getElementById('calcular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

botaoCalcular.addEventListener('click', () => {
  const consumo = campoConsumo.valueAsNumber;
  const tipo = campoTipo.value as TipoCliente;
  const bandeira = campoBandeira.value as Bandeira;

  if (isNaN(consumo) || consumo <= 0) {
    saida.textContent = 'Informe um consumo válido';
    saida.className = 'erro';
    return;
  }

  const valorEnergia = consumo * tarifaPorKwh(tipo);
  const valorBandeira = adicionalBandeira(consumo, bandeira);
  const total = valorEnergia + valorBandeira;
  const mensagem = mensagemBandeira(bandeira);

  saida.textContent = `Energia: R$ ${valorEnergia.toFixed(2)}
Bandeira ${bandeira}: R$ ${valorBandeira.toFixed(2)}
Total: R$ ${total.toFixed(2)}
${mensagem}`;

  saida.className = bandeira === 'verde' ? 'sucesso' : 'alerta';
});