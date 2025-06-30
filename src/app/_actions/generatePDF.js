'use server'

// server.js - Exemplo com Puppeteer
const puppeteer = require('puppeteer');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Seu componente React normal
const MyReactComponent = ({ data }) => (
  <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    <h1>Relatório Complexo</h1>
    <div className="card">
      <h2>Dados do Cliente</h2>
      <p>Nome: {data.nome}</p>
      <button>Botão de exemplo</button>
    </div>
    <div className="chart">
      {/* Aqui você poderia usar Chart.js, D3, etc */}
      <canvas id="myChart"></canvas>
    </div>
  </div>
);

async function generatePDF(data) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Renderiza o componente React para HTML
  const html = ReactDOMServer.renderToString(
    React.createElement(MyReactComponent, { data })
  );

  // HTML completo com CSS
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 20px; }
          .card { border: 1px solid #ccc; padding: 15px; margin: 10px 0; }
          h1 { color: #333; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  await page.setContent(fullHtml);

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  await browser.close();
  return pdf;
}

export { generatePDF }