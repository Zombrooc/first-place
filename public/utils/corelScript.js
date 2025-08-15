const PAGE_WIDTH = 1200;

const mmToPoints = (mm) => {
  return mm * 2.8346456692913;
}

// Set unit before creating page to ensure consistency
host.ActiveDocument.Unit = cdrMillimeter;

// Create the classification page at the beginning
let classificationPage = host.ActiveDocument.InsertPagesEx(1, false, 1, false, false);
classificationPage.SizeWidth = PAGE_WIDTH;
classificationPage.SizeHeight = PAGE_WIDTH;

// Move the new page to position 1
classificationPage.MoveTo(1);

// Ensure target layer exists on the classification page
var targetPage = host.ActiveDocument.Pages.Item(1);
var targetLayer;

try {
  targetLayer = targetPage.Layers.Item(2);
} catch (e) {
  // If no layers exist, create one
  targetLayer = targetPage.Layers.Add();
}

for (var i = host.ActiveDocument.Pages.Count; i > 1; i--) {

  let currentPage = host.ActiveDocument.Pages.Item(i);
  var currentPageShapes = currentPage.Shapes.All();

  // Process the text box on this page
  if (currentPageShapes.Count > 0) {
    // Select all shapes on current page
    currentPageShapes.CreateSelection();

    // Group the shapes (even if it's just one text box, for consistency)
    if (host.ActiveSelection.Shapes.Count > 0) {
      let groupedShape = host.ActiveSelection.Group();

      // Move the grouped shape to target layer on classification page
      groupedShape.MoveToLayer(targetLayer);

      // Order to front to avoid overlapping issues
      groupedShape.OrderToFront();
    }
  }

  // Delete the current page (page 2) - this moves the next page to position 2
  currentPage.Delete();
}

// Now arrange all collected objects in a grid on the classification page
host.ActiveDocument.Pages.Item(1).Activate();
var activePage = host.ActivePage;

// Get all objects on the classification page
var allObjects = activePage.Shapes.All();

// Use the first object to determine cell dimensions
var firstObject = allObjects.Item(1);
if (firstObject) {
  // Define cell dimensions - adding padding so objects don't touch
  var cellWidth = firstObject.SizeWidth + 5;  // 5mm padding
  var cellHeight = firstObject.SizeHeight + 5; // 5mm padding

  // Calculate grid dimensions
  var pageWidth = activePage.SizeWidth;
  var numCols = Math.floor(pageWidth / cellWidth);

  // Ensure at least 1 column
  if (numCols < 1) numCols = 1;

  var numRows = Math.ceil(allObjects.Count / numCols);

  // Adjust page height to fit all rows
  activePage.SizeHeight = (cellHeight * numRows) + cellHeight; // Extra row for margin

  // Arrange objects in grid starting from top-left
  for (var i = 1; i <= allObjects.Count; i++) {
    var object = allObjects.Item(i);

    if (object) {
      // Calculate grid position (0-based)
      var row = Math.floor((i - 1) / numCols);
      var col = (i - 1) % numCols;

      // Calculate position with margin from edges
      var newX = (col * cellWidth) + (cellWidth / 2 - object.SizeWidth / 2); // Center in cell
      var newY = (row * cellHeight) + (cellHeight / 2 - object.SizeHeight / 2) + cellHeight; // Center in cell + top margin

      // Set the new position
      object.PositionX = newX;
      object.PositionY = newY;


    }
  }

  allObjects = activePage.Shapes.All();
  if (allObjects.Count > 0) {
    allObjects.CreateSelection();
    if (host.ActiveSelection.Shapes.Count > 0) {
      const finalClassifications = host.ActiveSelection.Group();
    }
  }

}