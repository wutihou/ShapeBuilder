var circle = new ShapeBuilder(".svg-container#circle");
circle.setSize(150,150);
circle.setShape("circle");
circle.fill("#73a093");
circle.setSize(75,75);

var rectangle = new ShapeBuilder(".svg-container#rectangle");
rectangle.setSize(150,150);
rectangle.setShape("rectangle");
rectangle.fill("#73a093");
rectangle.setSize(75,70);

var triangle = new ShapeBuilder(".svg-container#triangle");
triangle.setSize(150,150);
triangle.setShape("triangle");
triangle.fill("#73a093");
triangle.setSize(150,75);

var star = new ShapeBuilder(".svg-container#star");
star.setSize(150,150);
star.setShape("star");
star.fill("#73a093");
star.setSize(75,150);

var trapezoid = new ShapeBuilder(".svg-container#trapezoid");
trapezoid.setSize(150,150);
trapezoid.setShape("trapezoid");
trapezoid.fill("#73a093");
trapezoid.setSize(150,75);

var arrowright = new ShapeBuilder(".svg-container#arrowright");
arrowright.setSize(150,150);
arrowright.setShape("arrowright");
arrowright.fill("#73a093");
arrowright.setSize(36,80);

var triangleright = new ShapeBuilder(".svg-container#triangleright");
triangleright.setSize(150,150);
triangleright.setShape("triangleright");
triangleright.fill("#73a093");
triangleright.setSize(90,150);

var sevenpiecepuzzle = new ShapeBuilder(".svg-container#sevenpiecepuzzle");
sevenpiecepuzzle.setSize(75,75);
sevenpiecepuzzle.setShape("sevenpiecepuzzle");
sevenpiecepuzzle.fill("#73a093");
var children = sevenpiecepuzzle.getChildren();
children[0].fill("#546302");
children[0].setSize(50,50);

var line = new ShapeBuilder(".svg-container#line");
line.setSize(150,150);
line.setShape("line");
line.line(0,0,150,150);

var halfcircle = new ShapeBuilder(".svg-container#halfcircle");
halfcircle.setSize(150,150);
halfcircle.setShape("halfcircle");
halfcircle.fill("#73a093");