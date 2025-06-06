# 🏆 First Place

**Automatize a geração de classificações para premiações esportivas em segundos.**

First Place é uma plataforma web desenvolvida para auxiliar os designers da empresa Uniart Troféus na escrita de classificações que vão nas medalhas, troféus, homenagens, faixas, escarapelas e outros produtos produzidos pela empresa onde atuo como gestor do time de design. Antes, esse processo podia levar até **1h30 de digitação manual** por evento. Com o First Place, **essa tarefa é resolvida em poucos segundos**.

---

## 💡 O que é

Uma ferramenta simples que transforma uma planilha do Excel com sintaxe padronizada em um arquivo `.csv` pronto para ser utilizado no recurso de **impressão mesclada do CorelDRAW**. A plataforma também inclui um **macro em JavaScript** que organiza todas as classificações em grid no Corel, otimizando o processo de organização e impressão após conferencia.

---

## ⚙️ Como Funciona

1. Você preenche uma planilha Excel seguindo uma sintaxe pré-definida.
2. A plataforma valida e transforma os dados: remove espaços, padroniza textos, aplica regras de expansão e monta as classificações.
3. Um arquivo `.csv` é gerado, pronto para ser utilizado no CorelDRAW onde então será usado a ferramenta de Impressão Mesclada.
4. Um script macro organiza automaticamente todos os textos em grade, direto no layout da arte.

---

## 📄 Estrutura da Planilha de Entrada

A planilha contém as seguintes colunas:

| Coluna         | Descrição                                                                 |
|----------------|---------------------------------------------------------------------------|
| Quantidade     | Quantidade de vezes que cada classificação deve ser repetida                |
| Classificação  | Pode ser um número (`1`), intervalo (`1-3`), lista (`1,3,5`) ou texto (`Campeão`) |
| Nomenclatura   | Define se será "posição", "lugar", "colocação", etc                      |
| Categoria      | Utiliza uma sintaxe específica para expansão dinâmica  |
| Observações    | Campo opcional para mensagens adicionais                                 |

---

## 🧠 Regras de Expansão

### Categorias

A coluna **Categoria** aceita variações que são automaticamente expandidas. Exemplos:

```js
expandCategories("Geral")
// → ["Geral"]

expandCategories("Feminino/Masculino")
// → ["Feminino", "Masculino"]

expandCategories("Geral | Feminino/Masculino")
// → ["Geral Feminino", "Geral Masculino"]

expandCategories("Regional | Sul/Sudeste | Masculino/Feminino")
// → ["Regional Sul Masculino", "Regional Sul Feminino", "Regional Sudeste Masculino", "Regional Sudeste Feminino"]
````

### Classificações

| Classificação | Nomenclatura | Resultado             |
| ------------- | ------------ | --------------------- |
| `1`           | posição      | 1ª posição            |
| `1-3`         | lugar        | 1º, 2º, 3º lugar      |
| `1,3,5`       | colocação    | 1ª, 3ª, 5ª colocação  |
| `Campeão`     | —            | Campeão (sem ordinal) |

Tudo isso é combinado automaticamente com as categorias expandidas, gerando resultados como:

* 1º lugar - Masculino
* 2º lugar - Sub-18
* Campeão - Absoluto
* 3ª colocação - Regional Feminino

---

## 🖨️ Macro para CorelDRAW

O projeto acompanha um **script em JavaScript** que funciona como macro no CorelDRAW (a partir da versão X8).

* Organiza automaticamente as classificações geradas em uma grade.
* Usa como base o **tamanho da arte**, **quantidade de colunas** e **margens predefinidas**.
* Reduz drasticamente o tempo de organização manual antes da impressão.

---

## 🚀 Tecnologias Utilizadas

* [Next.js 15](https://nextjs.org/) — Framework para frontend e backend unificados
* [Prisma ORM](https://www.prisma.io/) — Abstração de banco de dados
* [Tailwind CSS](https://tailwindcss.com/) — Estilização rápida e responsiva
* [xlsx](https://www.npmjs.com/package/xlsx) — Leitura e parsing de planilhas
* JavaScript para macros no CorelDRAW

---

## 🧭 Impacto

Antes do First Place:

* Até **1h30 de digitação manual** por pedido.
* Alto risco de erros humanos.
* Processo repetitivo e desgastante.

Com o First Place:

* **Menos de 1 minuto** para gerar todas as classificações.
* Fluxo padronizado, replicável e com zero erro de formatação.
* Liberação de tempo e energia criativa para o time focar em design de verdade.

---

## 📌 Próximos Passos

* Painel com histórico de arquivos gerados
* Autenticação
* Painel público para que os clientes validem o resultado final das classificações
* Definição de multiplos modos de operação para abranger mais casos de uso e produtos mais diversos
* Adição de função para reduzir ou quebrar linhas automáticamente já dentro do CorelDraw

---

## ✍️ Autor

Desenvolvido por Elian Valdez — gestor de design.
