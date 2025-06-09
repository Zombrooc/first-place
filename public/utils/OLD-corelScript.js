
const PAGE_WIDTH = 1200;

const mmToPoints = (mm) => {
  return mm * 2.8346456692913;
}

let classificationPage = host.ActiveDocument.InsertPagesEx(1, false, 1, false, false);

host.ActiveDocument.Unit = cdrMillimeter;
classificationPage.SizeWidth = PAGE_WIDTH;
classificationPage.SizeHeight = PAGE_WIDTH;

host.ActivePage.MoveTo(1);

var targetLayer = host.ActiveDocument.Pages.Item(1).Layers.Item(2);

let pageCount = host.ActiveDocument.Pages.Count;


for (var i = pageCount; i > 1; i--) {
  // for (var i = 2; i <= pageCount; i++) {
  let currentPage = host.ActiveDocument.Pages.Item(i);
  var currentPageShapes = currentPage.Shapes.All();

  // Move all shapes on the current page to the target layer
  if (currentPageShapes.Count > 0) {
    // host.Shapes.All().CreateSelection();
    // let groupedShape = host.ActiveSelection.Group();
    // groupedShape.MoveToLayer(targetLayer);
    // Move all shapes on the current page to the target layer
    currentPageShapes.CreateSelection();
    host.ActiveSelection.MoveToLayer(targetLayer);
    currentPageShapes.CreateSelection();
    let groupedShape = host.ActiveSelection.Group();

    // Move all shapes on the current page to the target layer

    // groupedShape.MoveToLayer(targetLayer);

    // Order the shapes to the front on the current page
    // for (var j = 1; j <= currentPageShapes.Count; j++) {
    //   currentPageShapes.Item(j).OrderToFront();
    // }

    // currentPage.Remove();
    // host.ActiveDocument.Pages.Item(current).Delete();


  }

}


// Get the active page
var activePage = host.ActivePage;

// Get all objects or groups on the active page
var allObjects = activePage.Shapes.All();

// Define the desired width and height of each cell (based on the size of the first object)
var cellWidth = allObjects.Item(1).SizeWidth + 1.5;
var cellHeight = allObjects.Item(1).SizeHeight + 1.5;

// Calculate the number of columns based on the page's width
var pageWidth = activePage.SizeWidth;
var numCols = Math.floor(pageWidth / cellWidth);

// Calculate the number of rows necessary to accommodate all objects with the same size
var numRows = Math.ceil(allObjects.Count / numCols);

classificationPage.SizeHeight = cellHeight * numRows;

// Iterate through all objects and position them in the grid
for (var i = 1; i < allObjects.Count + 1; i++) {
  var object = allObjects.Item(i);

  // Check if the object is not null
  if (object != null) {
    // Calculate the grid position 
    // var row = Math.floor(i / numCols) + 1;
    // var col = i % numCols;
    var row = Math.floor((i - 1) / numCols);
    var col = (i - 1) % numCols;

    // Calculate the new position
    var newX = (col * cellWidth);
    var newY = row * cellHeight;

    // Set the new position for the object
    object.PositionX = newX;
    object.PositionY = newY;
  }
}

allObjects = activePage.Shapes.All();
allObjects.CreateSelection();
const classifications = host.ActiveSelection.Group();

classifications.PositionY += cellHeight;


// --------------------------------------------

while (host.ActiveDocument.Pages.Count > 1) {
  host.ActiveDocument.Pages.Item(2).Delete();
}