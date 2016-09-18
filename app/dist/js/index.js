var circle = new ShapeBuilder(".svg-container#circle");
circle.setSize(50,150);
circle.setShape("circle");
circle.fill("#73a093");
circle.setSize(150,150);

var rectangle = new ShapeBuilder(".svg-container#rectangle");
rectangle.setSize(150,150);
rectangle.setShape("rectangle");
rectangle.fill("#73a093");

var triangle = new ShapeBuilder(".svg-container#triangle");
triangle.setSize(150,150);
triangle.setShape("triangle");
triangle.fill("#73a093");

var star = new ShapeBuilder(".svg-container#star");
star.setSize(150,150);
star.setShape("star");
star.fill("#73a093");

var trapezoid = new ShapeBuilder(".svg-container#trapezoid");
trapezoid.setSize(150,150);
trapezoid.setShape("trapezoid");
trapezoid.fill("#73a093");

var arrowright = new ShapeBuilder(".svg-container#arrowright");
arrowright.setSize(150,150);
arrowright.setShape("arrowright");
arrowright.fill("#73a093");

var triangleright = new ShapeBuilder(".svg-container#triangleright");
triangleright.setSize(150,150);
triangleright.setShape("triangleright");
triangleright.fill("#73a093");

var sevenpiecepuzzle = new ShapeBuilder(".svg-container#sevenpiecepuzzle");
sevenpiecepuzzle.setSize(150,150);
sevenpiecepuzzle.setShape("sevenpiecepuzzle");
sevenpiecepuzzle.fill("#73a093");
var children = sevenpiecepuzzle.getChildren();
children[0].fill("#546302");

var line = new ShapeBuilder(".svg-container#line");
line.setShape("line");
line.line(0,0,150,150);

var linesegment = new ShapeBuilder(".svg-container#linesegment");
linesegment.setShape("linesegment");
linesegment.line(150,0,0,150);

var halfcircle = new ShapeBuilder(".svg-container#halfcircle");
halfcircle.setSize(150,150);
halfcircle.setShape("halfcircle");
halfcircle.fill("#73a093");

var plus = new ShapeBuilder(".svg-container#plus");
plus.setSize(150,150);
plus.setShape("plus");
plus.fill("#73a093");

var subtraction = new ShapeBuilder(".svg-container#subtraction");
subtraction.setSize(150,150);
subtraction.setShape("subtraction");
subtraction.fill("#73a093");

var multiple = new ShapeBuilder(".svg-container#multiple");
multiple.setSize(150,150);
multiple.setShape("multiple");
multiple.fill("#73a093");

var division = new ShapeBuilder(".svg-container#division");
division.setSize(150,150);
division.setShape("division");
division.fill("#73a093");

var equal = new ShapeBuilder(".svg-container#equal");
equal.setSize(150,150);
equal.setShape("equal");
equal.fill("#73a093");

var morethan = new ShapeBuilder(".svg-container#morethan");
morethan.setSize(150,150);
morethan.setShape("morethan");
morethan.fill("#73a093");

var lessthan = new ShapeBuilder(".svg-container#lessthan");
lessthan.setSize(150,150);
lessthan.setShape("lessthan");
lessthan.fill("#73a093");

var moreequal = new ShapeBuilder(".svg-container#moreequal");
moreequal.setSize(150,150);
moreequal.setShape("moreequal");
moreequal.fill("#73a093");

var lessequal = new ShapeBuilder(".svg-container#lessequal");
lessequal.setSize(150,150);
lessequal.setShape("lessequal");
lessequal.fill("#73a093");

var parallelogram = new ShapeBuilder(".svg-container#parallelogram");
parallelogram.setSize(150,150);
parallelogram.setShape("parallelogram");
parallelogram.fill("#73a093");