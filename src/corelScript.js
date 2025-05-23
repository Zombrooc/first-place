
const PAGE_WIDTH = 1200;


let classificationPage = host.ActiveDocument.InsertPagesEx(1, false, host.ActivePage.Index, mmToPoints(PAGE_WIDTH), mmToPoints(PAGE_WIDTH));






const mmToPoints = (mm) => {
  return mm * 2.8346456692913;
}