/* eslint-disable @typescript-eslint/no-unused-vars */
import blobStream from "blob-stream";

import * as XLSX from "xlsx/xlsx.mjs";
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";

import {
  expandCategory,
  expandClassification,
} from "@/lib/utils";

export async function POST(req) {

  const formData = await req.formData()
  const isBelt = formData.get('isBelt') === 'true';
  const selectedFile = formData.get('file')

  if (!selectedFile) {
    return Respose.json({ fileList: [], error: ['Arquivo inválido'] });
  }

  try {
    const data = await selectedFile.arrayBuffer();

    const [fileName, fileExtension] = selectedFile.name.split(".");

    const workbook = XLSX.read(data);

    let fileList = [];

    const validationText = [
      ["Produto", "Classificação", "Categoria", "Quantidade"],
    ];

    if (isBelt) {

      let missingColumns = null;

      workbook.SheetNames.forEach((sheet, i) => {
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]], { header: 1 });

        const headers = rows.length ? rows[0] : [];

        const required = ["Quantidade",
          "Classificação",
          "Categoria",
          "Nomeclatura",
          "Cor"];

        const missing = required.filter(h => !headers.includes(h));

        if (missing.length > 0) {
          const sheetName = workbook.SheetNames[i]
          missingColumns = {
            [sheetName]: missing
          }
        }
      });

      if (missingColumns) {
        return Response.json({
          fileList: [],
          error: [Object.keys(missingColumns).map(a => `Faltam as colunas ${missingColumns[a].map(b => b).join(', ')} na planilha ${a}`)]
        })
      }

      workbook.SheetNames.forEach((sheet, i) => {
        const fileContent = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[i]]
        );

        let unorganizedCSV = [];
        let beltColors = [];

        fileContent.map(
          ({
            Quantidade: quantityForEachClassification,
            Classificação: classification,
            Categoria: category = "",
            Nomeclatura: nomenclature = "",
            Cor: color,
          }) => {
            const expandedClassifications = expandClassification(
              classification,
              nomenclature
            );

            beltColors.push(color);

            const expandedCategories = expandCategory(category) || [];

            const classificationQuantity =
              (expandedCategories.length === 0
                ? expandedClassifications.length
                : expandedCategories.length * expandedClassifications.length) * quantityForEachClassification;

            validationText.push([
              `${color.charAt(0).toUpperCase() + color.slice(1)}`,
              `${classification.replace("_", "-")}${nomenclature ? " " : ""
              }${nomenclature}`,
              `${category}`,
              `${classificationQuantity}`,
            ]);

            for (let x = 0; x < quantityForEachClassification; x++) {
              if (expandedCategories.length === 0) {
                expandedClassifications.forEach((classificationValue) => {
                  unorganizedCSV.push({
                    classification: `${classificationValue}${nomenclature ? " " : ""
                      }${nomenclature}`,
                    category: "",
                    color,
                  });
                });
              } else {
                expandedCategories.forEach((categoryValue) => {
                  expandedClassifications.forEach((classificationValue) => {
                    unorganizedCSV.push({
                      classification: `${classificationValue}${nomenclature ? " " : ""
                        }${nomenclature}`,
                      category: `${categoryValue}`,
                      color,
                    });
                  });
                });
              }
            }
          }
        );

        [...new Set(beltColors)].map((color) => {
          const csvContent = [["Classificação", "Categoria"]];
          const filteredCSV = unorganizedCSV.filter(
            ({ color: sColor }) => sColor === color
          );

          filteredCSV.map(({ classification, category }) =>
            csvContent.push([classification, category])
          );

          fileList.push({
            fileName: `${fileName.replace(".", "")} - ${color}.csv`,
            csvContent,
            fileSize: new Blob([csvContent]).size,
          });
        });
      });
    }

    if (!isBelt) {

      let missingColumns = null;

      workbook.SheetNames.forEach((sheet, i) => {
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]], { header: 1 });

        const headers = rows.length ? rows[0] : [];

        const required = ["Quantidade",
          "Classificação",
          "Categoria",
          "Nomeclatura",
          "Produto"];

        const missing = required.filter(h => !headers.includes(h));

        if (missing.length > 0) {
          const sheetName = workbook.SheetNames[i]
          missingColumns = {
            [sheetName]: missing
          }
        }
      });

      if (missingColumns) {
        return Response.json({
          fileList: [],
          error: [Object.keys(missingColumns).map(a => `Faltam as colunas ${missingColumns[a].map(b => b).join(', ')} na planilha ${a}`)]
        })
      }

      workbook.SheetNames.forEach((sheet, i) => {

        const fileContent = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[i]]
        );

        const csvContent = [["Classificação", "Categoria"]];

        fileContent.map(
          ({
            Quantidade: quantityForEachClassification,
            Classificação: classification,
            Categoria: category = "",
            Nomeclatura: nomenclature = "",
            Produto: productType,
          }, i) => {

            const expandedClassifications = expandClassification(
              classification,
              nomenclature
            );

            const expandedCategories = expandCategory(category) || [];

            const classificationQuantity =
              (expandedCategories.length === 0
                ? expandedClassifications.length
                : expandedCategories.length * expandedClassifications.length) * quantityForEachClassification;

            validationText.push([
              `${productType.charAt(0).toUpperCase() + productType.slice(1)}`,
              `${classification.replace("_", "-")}${nomenclature ? " " : ""
              }${nomenclature}`,
              `${category}`,
              `${classificationQuantity}`,
            ]);

            for (let x = 0; x < quantityForEachClassification; x++) {
              if (expandedCategories.length === 0) {
                expandedClassifications.forEach((classificationValue) => {
                  csvContent.push([
                    `${classificationValue}${nomenclature ? " " : ""
                    }${nomenclature}`,
                    "",
                  ]);
                });
              } else {
                expandedCategories.forEach((categoryValue) => {
                  expandedClassifications.forEach((classificationValue) => {
                    csvContent.push([
                      `${classificationValue}${nomenclature ? " " : ""
                      }${nomenclature}`,
                      `${categoryValue}`,
                    ]);
                  });
                });
              }
            }
          }
        );

        fileList.push({
          fileName: `${fileName.replace(".", "")} - ${sheet}.csv`,
          csvContent,
          fileSize: new Blob([fileContent]).size,
        });
      });
    }

    const doc = new PDFDocument();

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    // doc.on('end', () => { });

    doc.table({
      data: validationText,
      defaultStyle: {
        margin: 0.5,
        fontSize: 12,
        font: "Helvetica",
        borderColor: "gray",
      },
    });

    doc.end();

    // Espera o PDF terminar de ser gerado
    await new Promise((resolve) => doc.on('end', resolve));

    const pdfBlob = new Blob(chunks, { type: 'application/pdf' });
    const pdfArrayBuffer = await pdfBlob.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64')

    fileList.push({
      fileName: `${fileName.replace(".", "")} - Conferência.pdf`,
      fileSize: pdfBlob.size,
      validationFile: pdfBase64,
    });

    // Gerar PDF de conferência e adicionar ao fileList
    // const doc = new PDFDocument();
    // const stream = doc.pipe(blobStream());



    // await new Promise((resolve) => {
    //   stream.on("finish", function () {
    //     const blob = stream.toBlob("application/pdf");
    //     let validationFileURL = stream.toBlobURL("application/pdf");

    //     fileList.push({
    //       fileName: `${fileName.replace(".", "")} - Conferência.pdf`,
    //       fileSize: blob.size,
    //       validationFile: validationFileURL,
    //     });
    //     resolve();
    //   });
    // });

    console.log('File List: ', fileList)

    return Response.json({ fileList, error: [] }, { status: 200 })
  } catch (error) {

    return Response.json({ fileList: [], error: ["Erro ao processar o arquivo. Verifique se o arquivo está no formato correto."] }, { status: 500 })

  }
}