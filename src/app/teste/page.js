import { generatePDF } from '../_actions/generatePDF';

export default async function Teste() {

  const pdfBuffer = await generatePDF({ nome: 'João Silva' });

  console.log(pdfBuffer)

  return (
    <h1> Use This page </h1>
  )
}