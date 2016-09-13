(function() {

	var supportShape = {
		circle:"circle",//圆
		rectangle:"rectangle",//矩形
		triangle:"triangle",//三角形
		star:"lazyRender",//五角星
		sevenpiecepuzzle:"sevenpiecepuzzle",//七巧板
		trapezoid:"lazyRender",//梯形
		arrowright:"lazyRender",//右箭头
		triangleright:"lazyRender"//直角三角形
	};
	
	var ShapeBuilder = function(selector) {
		if (!window.Snap) {
			throw new Error("缺少Snap.svg库");
		}

		this._initSb(selector);
	};
	
	/**
	 * 初始化
	 */
	ShapeBuilder.prototype._initSb = function(selector){
		var svg, w, h,
			d = document.querySelector(selector);
		if (d && d.tagName.toLowerCase() != "svg") { //传入的不是一个svg标签，就需要手动创建svg标签
			w = d.clientWidth;
			h = d.clientHeight;
		}else{
			throw new Error("已经是一个svg");
		}

		this.supportShape = supportShape;
		this.mOption = {
			shapeType:null,
			width:w?w:0,
			height:h?h:0,
			wrap:d
		};//配置参数
		this.mRender = null;//渲染器，默认圆形
	};
	
	/**
	 * 设置当前形状
	 * @param {Object} shape
	 */
	ShapeBuilder.prototype.setShape = function(shape){
		if(!this.supportShape[shape]){
			throw new Error("不支持该形状");
		}
		if(this.mOption.shapeType == shape){
			return;
		}else{
			if(this.mRender && this.mRender.clearAll){
				this.mRender.clearAll();
			}
			this.mRender = new Render[this.supportShape[shape]](this,shape);
			this.mOption.shapeType = this.mRender.getShapeType();
		}
	};
	/**
	 * 更新视图
	 */
	ShapeBuilder.prototype.refresh = function(){
		if(this.mRender.onRefresh){
			this.mRender.onRefresh.apply(this.mRender,arguments);
		}
	};
	
	/**
	 * 填充颜色
	 * @param {Object} color
	 */
	ShapeBuilder.prototype.fill = function(color){
		this.mRender.fill(color);
	};

	this.ShapeBuilder = ShapeBuilder;
	
	/**
	 * 渲染器
	 */
	var Render = (function(){
		var renders = {};
		
		function BasicRender(){
			this.defaultAttr = {
				stroke:"#000",
				strokeWidth:2
			};
		}

		BasicRender.prototype.super = function(){
			this.mInstance = null;
			this.mOption = {
				width:0,
				height:0,
				isRendered:-1,//isRendered==-1：未初始，isRendered==0：初始化，未渲染，isRendered>0:已渲染
				waiting:false//是否等待加载svg文件
			};
		};
		
		/**
		 * 填充颜色
		 * @param {Object} color
		 */
		BasicRender.prototype.fill = function(color){
			if(!this.mInstance){
				if(this.mOption.waiting === true){//如果是外部加载的svg，需要等待
					setTimeout(function(){
						this.fill(color);
					}.bind(this),100);
				}else{
					throw new Error("图形没有绘制");
				}
			}else{
				this.onFill(color);
			}
		};

		/**
		 * 填充颜色实现
		 * @param color
		 */
		BasicRender.prototype.onFill = function(color){
			if(this.mInstance){
				this.mInstance.attr({
					fill:color
				});
			}
		};
		
		BasicRender.prototype.getShapeType = function(){
			return this.shapeType;
		};
		
		BasicRender.prototype.checkInArea = function(x,y){
			if(x >0 && x < this.mOption.width && y > 0 && y < this.mOption.height){
				return true;
			}
			return false;
		};

		/************************LazyRender渲染工具start***************************/
		function LazyRender(sb,type){
			this.super();
			if(!this.supportShape[type]){
				throw new Error("不支持该图形");
			}
			this.shapeType = this.supportShape[type];
			this.sb = sb;

			this.mOption.waiting = true;
			this.onLoadSvg();
		}
		LazyRender.prototype = new BasicRender();
		LazyRender.prototype.supportShape = {
			star:"star",//五角星
			trapezoid:"trapezoid",//梯形
			arrowright:"arrowright",//右箭头
			triangleright:"triangleright"//直角三角形
		};

		/**
		 * 清空
		 */
		LazyRender.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
		};

		LazyRender.prototype.onLoadSvg = function(){
			var shape = this.shapeType;
			var url = "../svg/"+shape+".svg";
			Snap.load(url,function(svg){
				this.mOption.isRendered++;
				this.sb.mOption.wrap.appendChild(svg.node);
				var snap = Snap(svg.node);
				this.snap = snap;
				this.mOption.width = snap.asPX("width");
				this.mOption.height = snap.asPX("height");
				this.mInstance = snap.select("path").attr(this.defaultAttr);
				this.mOption.isRendered++;
				this.mOption.waiting = false;
			},this);
		};

		LazyRender.prototype.onDraw = function(){

		};
		renders['lazyRender'] = LazyRender;
		/************************LazyRender渲染工具end***************************/
		
		
		/************************圆形渲染工具start***************************/
		function Circle(sb){
			this.super();
			this.shapeType = supportShape.circle;

		    var snap = Snap(sb.mOption.width,sb.mOption.height);
		    var svg = snap.node;
		    sb.mOption.wrap.appendChild(svg);

			this.snap = snap;
			this.mOption.width = sb.mOption.width;
			this.mOption.height = sb.mOption.height;
			this.o = {//圆心
				x:this.mOption.width/2,
				y:this.mOption.height/2,
				c:null,//圆心对应的元素对象,
				r:2
			};
			this.onDraw();
		}
		Circle.prototype = new BasicRender();

		/**
		 * 清空所有图形
		 */
		Circle.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
			if(this.o.c){
				this.o.c.remove();
			}
		};
		Circle.prototype.onDraw = function(){
			this.mOption.isRendered++;
			var cx = this.o.x,
				cy = this.o.y,
				r = Math.min(cx,cy) - this.defaultAttr.strokeWidth/2;
			if(this.mOption.isRendered === 0){//初次渲染
				this.mInstance = this.snap.circle(cx,cy,r).attr(this.defaultAttr);
				this.o.c = this.snap.circle(cx,cy,this.o.r).attr("fill-opacity",0);//圆心
			}else{//二次渲染
				//TODO
			}
			this.mOption.isRendered++;
		};
		renders[supportShape.circle] = Circle;
		/************************圆形渲染工具end***************************/
		
		/*
		 *
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 */
		
		/************************矩形渲染工具start***************************/
		function Rectangle(sb){
			this.super();
			this.shapeType = supportShape.rectangle;

			var snap = Snap(sb.mOption.width,sb.mOption.height);
			var svg = snap.node;
			sb.mOption.wrap.appendChild(svg);

			this.snap = snap;
			this.mOption.width = snap.asPX("width");
			this.mOption.height = snap.asPX("height");
			this.onDraw();
		}
		Rectangle.prototype = new BasicRender();

		/**
		 * 清空
		 */
		Rectangle.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
		};

		Rectangle.prototype.onDraw = function(){
			this.mOption.isRendered++;
			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;

			var x = this.defaultAttr.strokeWidth/2,
				y=this.defaultAttr.strokeWidth/2;
			var	width = clientWidth - this.defaultAttr.strokeWidth,
				height = clientHeight - this.defaultAttr.strokeWidth;

			if(this.mOption.isRendered === 0) {//初次渲染
				this.mInstance = this.snap.rect(x,y,width,height).attr(this.defaultAttr);
			}else{//二次渲染
				//TODO
			}
			this.mOption.isRendered++;
		};
		renders[supportShape.rectangle] = Rectangle;
		/************************矩形渲染工具end***************************/
		
		/*
		 *
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 */
		
		/************************三角形渲染工具start***************************/
		function Triangle(sb){
			this.super();
			this.shapeType = supportShape.triangle;

			var snap = Snap(sb.mOption.width,sb.mOption.height);
			var svg = snap.node;
			sb.mOption.wrap.appendChild(svg);

			this.snap = snap;
			this.mPoint = {
				p1:{
					x:0,
					y:0,
					r:0,
					c:null
				},
				p2:{
					x:0,
					y:0,
					r:0,
					c:null
				},
				p3:{
					x:0,
					y:0,
					r:0,
					c:null
				}
			};
			this.mOption.width = sb.mOption.width;
			this.mOption.height = sb.mOption.height;
			this.mOption.pointSize = 0;
			this.onDraw();
		}
		Triangle.prototype = new BasicRender();
		/**
		 * 清空
		 */
		Triangle.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
			for(var p in this.mPoint){
				if(this.mPoint[p].c){
					this.mPoint[p].c.remove();
				}
			}
		};
		Triangle.prototype.onDraw = function(){
			
			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;
			var path;

			this.mOption.isRendered++;
			if(this.mOption.isRendered === 0){//初次渲染
				this.mPoint.p1.x = clientWidth/2,this.mPoint.p1.y = this.mOption.pointSize*2,
				this.mPoint.p2.x = this.mOption.pointSize*2,this.mPoint.p2.y = clientHeight-this.mOption.pointSize-this.defaultAttr.strokeWidth,
				this.mPoint.p3.x = clientWidth-this.mOption.pointSize*2,this.mPoint.p3.y = clientHeight-this.mOption.pointSize-this.defaultAttr.strokeWidth,
				this.mPoint.p1.r = this.mPoint.p2.r = this.mPoint.p3.r = this.mOption.pointSize+1;
				
				//绘制三角形
				path = "M" + this.mPoint.p1.x + " " + this.mPoint.p1.y + " L" + this.mPoint.p2.x + " " + this.mPoint.p2.y + " L" + this.mPoint.p3.x + " " + this.mPoint.p3.y + "Z";
				this.mInstance = this.snap.path(path).attr(this.defaultAttr);
				
				//绘制顶点圆
				this.mPoint.p1.c = this.snap.circle(this.mPoint.p1.x,this.mPoint.p1.y,this.mPoint.p1.r).attr("key","p1");
				this.mPoint.p2.c = this.snap.circle(this.mPoint.p2.x,this.mPoint.p2.y,this.mPoint.p2.r).attr("key","p2");
				this.mPoint.p3.c = this.snap.circle(this.mPoint.p3.x,this.mPoint.p3.y,this.mPoint.p3.r).attr("key","p3");

				//绑定事件
				unBindEvent.call(this);
				bindEvent.call(this);
			}else{//二次渲染
				//绘制三角形
				path = "M" + this.mPoint.p1.x + " " + this.mPoint.p1.y + " L" + this.mPoint.p2.x + " " + this.mPoint.p2.y + " L" + this.mPoint.p3.x + " " + this.mPoint.p3.y + "Z";
				this.mInstance.attr("d",path);
				
				//绘制顶点圆
				this.mPoint.p1.c.attr({
					cx:this.mPoint.p1.x,
					cy:this.mPoint.p1.y,
					r:this.mPoint.p1.r
				});
				this.mPoint.p2.c.attr({
					cx:this.mPoint.p2.x,
					cy:this.mPoint.p2.y,
					r:this.mPoint.p2.r
				});
				this.mPoint.p3.c.attr({
					cx:this.mPoint.p3.x,
					cy:this.mPoint.p3.y,
					r:this.mPoint.p3.r
				});
			}
			this.mOption.isRendered++;
			
			function bindEvent(){
				this.mPoint.p1.c.drag(this.InnerEvent.pointDragMove,this.InnerEvent.pointDragStart,this.InnerEvent.pointDragEnd,this);//
				this.mPoint.p2.c.drag(this.InnerEvent.pointDragMove,this.InnerEvent.pointDragStart,this.InnerEvent.pointDragEnd,this);
				this.mPoint.p3.c.drag(this.InnerEvent.pointDragMove,this.InnerEvent.pointDragStart,this.InnerEvent.pointDragEnd,this);
			}
			function unBindEvent(){
				this.mPoint.p1.c.undrag();
				this.mPoint.p2.c.undrag();
				this.mPoint.p3.c.undrag();
			}
		};

		/**
		 * 刷新三角形视图
		 * @param x1 第1个点的横坐标
		 * @param y1 第1个点的纵坐标
		 * @param x2 第2个点的横坐标
		 * @param y2 第2个点的纵坐标
		 * @param x3 第3个点的横坐标
		 * @param y3 第3个点的纵坐标
		 */
		Triangle.prototype.onRefresh = function(x1,y1,x2,y2,x3,y3){
			this.mPoint.p1.x = x1;
			this.mPoint.p1.y = y1;
			this.mPoint.p2.x = x2;
			this.mPoint.p2.y = y2;
			this.mPoint.p3.x = x3;
			this.mPoint.p3.y = y3;
			this.onDraw();
		};

		/**
		 * 工具类
		 * @type {{forcePointInArea: Function}}
		 */
		Triangle.prototype.Util = {
			forcePointInArea: function (point) {
				if (point.x < 0) {
					point.x = 0;
				}
				if (point.x > this.mOption.width) {
					point.x = this.mOption.width;
				}
				if (point.y < 0) {
					point.y = 0;
				}
				if (point.y > this.mOption.height) {
					point.y = this.mOption.height;
				}
			},
			getCoreCoordinate:function(p1,p2,p3){
				var coreX = (p1.x + p2.x + p3.x)/3;
				var coreY = (p1.y + p2.y + p3.y)/3;
				return {x:coreX,y:coreY};
			}
		};

		/**
		 * 三角形工具事件
		 * @type {{pointDragStart: Function, pointDragMove: Function, pointDragEnd: Function}}
		 */
		Triangle.prototype.InnerEvent = {
			pointDragStart:function(x,y,ev){
				var data = this.mInstance.data();
				data.target = ev.target;
				var key = data.target.getAttribute("key");
				var target = this.mPoint[key];
				
				data.oriCx = target.c.asPX("cx");
				data.oriCy = target.c.asPX("cy");
			},
			pointDragMove:function(dx,dy,x,y,ev){
				var data = this.mInstance.data();
				var key = data.target.getAttribute("key");
				var target = this.mPoint[key];
				if(target){
					target.x = data.oriCx + dx;
					target.y = data.oriCy + dy;
					this.Util.forcePointInArea.call(this,target);
					this.onDraw();
				}
			},
			pointDragEnd:function(ev){
				var data = this.mInstance.data();
				data.target = null;
			}
		};
		renders[supportShape.triangle] = Triangle;
		/************************三角形渲染工具end***************************/

		/*
		 *
		 *
		 *
		 *
		 *
		 *
		 *
		 *
		 *
		 */

		/************************七巧板渲染工具start***************************/
		function Sevenpiecepuzzle(sb){
			this.super();
			this.shapeType = supportShape.sevenpiecepuzzle;
			var snap = Snap(sb.mOption.width,sb.mOption.height);
			var svg = snap.node;
			sb.mOption.wrap.appendChild(svg);

			this.snap = snap;
			this.subGraph = {//定义7个子图
				sub1:{
					points:[
						{
							x:0,
							y:0
						},
						{
							x:0,
							y:150
						},
						{
							x:75,
							y:75
						}
					],
					fill:"#008000",
					c:null
				},
				sub2:{
					points:[
						{
							x:0,
							y:0
						},
						{
							x:150,
							y:0
						},
						{
							x:75,
							y:75
						}
					],
					fill:"#0000ff",
					c:null
				},
				sub3:{
					points:[
						{
							x:0,
							y:150
						},
						{
							x:37.5,
							y:112.5
						},
						{
							x:112.5,
							y:112.5
						},
						{
							x:75,
							y:150
						}
					],
					fill:"#ff0080",
					c:null
				},
				sub4:{
					points:[
						{
							x:37.5,
							y:112.5
						},
						{
							x:75,
							y:75
						},
						{
							x:112.5,
							y:112.5
						}
					],
					fill:"#00ff00",
					c:null
				},
				sub5:{
					points:[
						{
							x:75,
							y:75
						},
						{
							x:112.5,
							y:37.5
						},
						{
							x:150,
							y:75
						},
						{
							x:112.5,
							y:112.5
						}
					],
					fill:"#ff8040",
					c:null
				},
				sub6:{
					points:[
						{
							x:112.5,
							y:37.5
						},
						{
							x:150,
							y:0
						},
						{
							x:150,
							y:75
						}
					],
					fill:"#804000",
					c:null
				},
				sub7:{
					points:[
						{
							x:75,
							y:150
						},
						{
							x:150,
							y:75
						},
						{
							x:150,
							y:150
						}
					],
					fill:"#ffff80",
					c:null
				}
			};
			this.mOption.width = sb.mOption.width;
			this.mOption.height = sb.mOption.height;
			this.mOption.size = Math.max(this.mOption.width,this.mOption.height);
			this.mOption.focus = null;

			this.onDraw();
		}
		Sevenpiecepuzzle.prototype = new BasicRender();

		/**
		 * 填充颜色实现
		 * @param color
		 */
		Sevenpiecepuzzle.prototype.onFill = function(color){
			if(this.mOption.focus){
				this.mOption.focus.attr({
					fill:color
				});
			}
		};

		/**
		 * 清空
		 */
		Sevenpiecepuzzle.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
		};

		Sevenpiecepuzzle.prototype.onDraw = function(){
			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;

			this.mOption.isRendered++;
			if(this.mOption.isRendered === 0){//初次渲染
				//绘制外框
				this.defaultAttr.fill = "#fff";
				this.mInstance = this.snap.rect(0,0,clientWidth,clientHeight).attr(this.defaultAttr);

				//绘制小图形
				var path, s, i,len,p;
				for(var sub in this.subGraph){
					s = this.subGraph[sub];
					path = "M ";
					if(s.points instanceof Array){
						for(i=0,len = s.points.length; i<len; i++){
							p = s.points[i];
							if(i>0){
								path += " L";
							}
							path += p.x + " " + p.y;
						}
						path += "Z";
					}
					this.defaultAttr.fill = s.fill;
					this.defaultAttr.key = sub;
					s.c = this.snap.path(path).attr(this.defaultAttr).click(clickSubGraph,this);
				}
			}else{//二次渲染

			}
			this.mOption.isRendered++;

			function clickSubGraph(ev){
				var key = ev.target.getAttribute("key");
				this.mOption.focus = this.subGraph[key].c;
			}
		};
		renders[supportShape.sevenpiecepuzzle] = Sevenpiecepuzzle;
		/************************七巧板渲染工具end***************************/
		return renders;
	})();
})(this);