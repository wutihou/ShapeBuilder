var circle = new ShapeBuilder(document.querySelector(".svg-container#circle"));
circle.setSize(150,150).setShape("circle").fill("#73a093").stroke("black");

var rectangle = new ShapeBuilder(".svg-container#rectangle");
rectangle.setSize(150,150);
rectangle.setShape("rectangle");
rectangle.fill("#73a093");
rectangle.stroke("#ff0000");

var triangle = new ShapeBuilder(".svg-container#triangle");
triangle.setSize(150,150);
triangle.setShape("triangle");
triangle.fill("#73a093");
triangle.stroke("#ff0000");

var star = new ShapeBuilder(".svg-container#star");
star.setSize(150,150);
star.setShape("star");
star.fill("#73a093");
star.stroke("#ff0000");

var trapezoid = new ShapeBuilder(".svg-container#trapezoid");
trapezoid.setSize(150,150);
trapezoid.setShape("trapezoid");
trapezoid.fill("#73a093");
trapezoid.stroke("#ff0000");

var arrowright = new ShapeBuilder(".svg-container#arrowright");
arrowright.setSize(150,150);
arrowright.setShape("arrowright");
arrowright.fill("#73a093");
arrowright.stroke("#ff0000");

var arrowleft = new ShapeBuilder(".svg-container#arrowleft");
arrowleft.setSize(150,150);
arrowleft.setShape("arrowleft");
arrowleft.fill("#73a093");
arrowleft.stroke("#ff0000");

var arrowup = new ShapeBuilder(".svg-container#arrowup");
arrowup.setSize(150,150);
arrowup.setShape("arrowup");
arrowup.fill("#73a093");
arrowup.stroke("#ff0000");

var arrowdown = new ShapeBuilder(".svg-container#arrowdown");
arrowdown.setSize(150,150);
arrowdown.setShape("arrowdown");
arrowdown.fill("#73a093");
arrowdown.stroke("#ff0000");

var arrowdouble = new ShapeBuilder(".svg-container#arrowdouble");
arrowdouble.setSize(150,150);
arrowdouble.setShape("arrowdouble");
arrowdouble.fill("#73a093");
arrowdouble.stroke("#ff0000");

var triangleright = new ShapeBuilder(".svg-container#triangleright");
triangleright.setSize(150,150);
triangleright.setShape("triangleright");
triangleright.fill("#73a093");
triangleright.stroke("#ff0000");

var sevenpiecepuzzle = new ShapeBuilder(".svg-container#sevenpiecepuzzle");
sevenpiecepuzzle.setSize(150,150).setShape("sevenpiecepuzzle");//创建1个宽高为150像素的七巧板
var children = sevenpiecepuzzle.getChildren();//获取七巧板子图数组
children[0].fill("black").stroke("#ff0000");//给编号为0的子图形填充黑色和边框蓝色
children[0].onMove(function(x,y){
    console.log(arguments);
});

var line = new ShapeBuilder(".svg-container#line");
line.setSize(150,150);
line.setShape("line").line(0,0,150,150).stroke("#ff0000");

var linehorizontal = new ShapeBuilder(".svg-container#linehorizontal");
linehorizontal.setSize(150,150);
linehorizontal.setShape("linehorizontal").stroke("#ff0000");

var linevertical = new ShapeBuilder(".svg-container#linevertical");
linevertical.setSize(150,150);
linevertical.setShape("linevertical").stroke("#ff0000");

var linesegment = new ShapeBuilder(".svg-container#linesegment");
linesegment.setShape("linesegment");
linesegment.line(150,0,0,150);
linesegment.stroke("#ff0000");

var dashline = new ShapeBuilder(".svg-container#dashline");
dashline.setShape("dashline");
dashline.line(150,0,0,150);
dashline.stroke("#ff0000");

var halfcircle = new ShapeBuilder(".svg-container#halfcircle");
halfcircle.setSize(424,189);
halfcircle.setShape("halfcircle");
halfcircle.fill("#73a093");
halfcircle.stroke("#ff0000");
halfcircle.setSize(150,150);

var plus = new ShapeBuilder(".svg-container#plus");
plus.setSize(150,150);
plus.setShape("plus");
plus.fill("#73a093");
plus.stroke("#ff0000");

var subtraction = new ShapeBuilder(".svg-container#subtraction");
subtraction.setSize(150,150);
subtraction.setShape("subtraction");
subtraction.fill("#73a093");
subtraction.stroke("#ff0000");

var multiple = new ShapeBuilder(".svg-container#multiple");
multiple.setSize(150,150);
multiple.setShape("multiple");
multiple.fill("#73a093");
multiple.stroke("#ff0000");

var division = new ShapeBuilder(".svg-container#division");
division.setSize(150,150);
division.setShape("division");
division.fill("#73a093");
division.stroke("#ff0000");

var equal = new ShapeBuilder(".svg-container#equal");
equal.setSize(150,150);
equal.setShape("equal");
equal.fill("#73a093");
equal.stroke("#ff0000");

var morethan = new ShapeBuilder(".svg-container#morethan");
morethan.setSize(150,150);
morethan.setShape("morethan");
morethan.fill("#73a093");
morethan.stroke("#ff0000");

var lessthan = new ShapeBuilder(".svg-container#lessthan");
lessthan.setSize(150,150);
lessthan.setShape("lessthan");
lessthan.fill("#73a093");
lessthan.stroke("#ff0000");

var moreequal = new ShapeBuilder(".svg-container#moreequal");
moreequal.setSize(150,150);
moreequal.setShape("moreequal");
moreequal.fill("#73a093");
moreequal.stroke("#00ff00");

var lessequal = new ShapeBuilder(".svg-container#lessequal");
lessequal.setSize(150,150);
lessequal.setShape("lessequal");
lessequal.fill("#73a093");
lessequal.stroke("#0000ff");

var parallelogram = new ShapeBuilder(".svg-container#parallelogram");
parallelogram.setSize(150,150);
parallelogram.setShape("parallelogram");
parallelogram.fill("#73a093");