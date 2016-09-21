(function() {

	var supportShape = {
		circle:"circle",//圆
		rectangle:"rectangle",//矩形
		triangle:"triangle",//三角形
		sevenpiecepuzzle:"sevenpiecepuzzle",//七巧板
		halfcircle:"halfcircle",//半圆
		line:"line",//直线
		linesegment:"line",//线段
		linehorizontal:"line",//水平线
		linevertical:"line",//垂直线
		dashline:"line",//虚线
		arrowright:"arrow",//右箭头
		arrowleft:"arrow",//左箭头
		arrowup:"arrow",//上箭头
		arrowdown:"arrow",//下箭头
		arrowdouble:"arrow",//双向箭头
		star:"lazyRender",//五角星
		trapezoid:"lazyRender",//梯形
		triangleright:"lazyRender",//直角三角形
		plus:"lazyRender",//加号
		subtraction:"lazyRender",//减号
		multiple:"lazyRender",//乘号
		division:"lazyRender",//除号
		equal:"lazyRender",//等号
		morethan:"lazyRender",//大于号
		moreequal:"lazyRender",//大于等于
		lessthan:"lazyRender",//小于号
		lessequal:"lazyRender",//小于等于
		parallelogram:"lazyRender",//四边形
		sevenpiece_sub1:"sevenpiece",//七巧板子图1
		sevenpiece_sub2:"sevenpiece",//七巧板子图2
		sevenpiece_sub3:"sevenpiece",//七巧板子图3
		sevenpiece_sub4:"sevenpiece",//七巧板子图4
		sevenpiece_sub5:"sevenpiece",//七巧板子图5
		sevenpiece_sub6:"sevenpiece",//七巧板子图6
		sevenpiece_sub7:"sevenpiece"//七巧板子图7
	};

	/**
	 * 构造函数
	 * @param arg可以是一个选择器或dom对象
	 * @constructor
	 */
	var ShapeBuilder = function(arg) {
		if (!window.Snap) {
			throw new Error("缺少Snap.svg库");
		}
		this._initSb(arg);
	};

	/**
	 * 初始化
	 */
	ShapeBuilder.prototype._initSb = function(arg){
		var svg, w, h,d;
			//
		if((typeof arg === "object") && (arg instanceof HTMLElement)){
			d = arg;
		}else if((typeof arg === "string")) {
			d = document.querySelector(arg)
		}
		if (d && d.tagName.toLowerCase() != "svg") { //传入的不是一个svg标签，就需要手动创建svg标签
			w = 0;
			h = 0;
			//强制设置外围div宽高为0
			d.style.width = "0px", d.style.height = "0px",d.style.lineHeight = 0;
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
			return this;
		}else{
			if(this.mRender && this.mRender.clearAll){
				this.mRender.clearAll();
			}
			this.mRender = new Render[this.supportShape[shape]](this,shape);
			this.mOption.shapeType = this.mRender.getShapeType();
		}
		return this;
	};

	/**
	 * 设置容器大小
	 * @param {Object} shape
	 */
	ShapeBuilder.prototype.setSize = function(width,height){
		if(this.mRender && this.mRender.onResize){
			this.mRender.onResize.call(this.mRender,width,height);
		}else{
			this.mOption.width = width;
			this.mOption.height = height;
		}
		return this;
	};

	/**
	 * 获取子图形
	 * @returns {*}
	 */
	ShapeBuilder.prototype.getChildren = function(){
		if(this.mRender && this.mRender.getChildren){
			return this.mRender.getChildren.call(this.mRender);
		}
		return null;
	};

	/**
	 * 画直线
	 * @param {Object} shape
	 */
	ShapeBuilder.prototype.line = function(x1,y1,x2,y2){
		//1、判断当前图形是否为直线
		if(this.mOption.shapeType != "line" && //
			this.mOption.shapeType != "linesegment"//
			&& this.mOption.shapeType != "dashline"//
			&& this.mOption.shapeType != "linehorizontal"//
			&& this.mOption.shapeType != "linevertical"){
			throw new Error("当前图形不是直线或线段!");
		}
		//2、重绘直线
		this.refresh(x1,y1,x2,y2);
		return this;
	};

	/**
	 * 更新视图
	 * 当前可用的图形：line
	 */
	ShapeBuilder.prototype.refresh = function(){
		if(this.mRender.onRefresh){
			this.mRender.onRefresh.apply(this.mRender,arguments);
		}
		return this;
	};
	
	/**
	 * 填充颜色
	 * @param {Object} color
	 */
	ShapeBuilder.prototype.fill = function(color){
		this.mRender.fill(color);
		return this;
	};

	/**
	 * 改变边框颜色
	 * @param {Object} color
	 */
	ShapeBuilder.prototype.stroke = function(color){
		this.mRender.stroke(color);
		return this;
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
			this.snap = null;
			this.mOption = {
				width:0,
				height:0,
				isRendered:-1,//isRendered==-1：未初始，isRendered==0：初始化，未渲染，isRendered>0:已渲染
				viewBoxWidth:150,
				viewBoxHeight:150
			};
		};
		
		/**
		 * 填充颜色
		 * @param {Object} color
		 */
		BasicRender.prototype.fill = function(color){
			if(this.mInstance && this.onFill){
				this.onFill(color);
			}
		};

		/**
		 * 改变边框颜色
		 * @param {Object} color
		 */
		BasicRender.prototype.stroke = function(color){
			if(this.mInstance && this.onStroke){
				this.onStroke(color);
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

		/**
		 * 填充颜色实现
		 * @param color
		 */
		BasicRender.prototype.onStroke = function(color){
			if(this.mInstance){
				this.mInstance.attr({
					stroke:color
				});
			}
		};

		BasicRender.prototype.setDefaultViewBox = function(){
			var viewBox = "0 0 " + this.mOption.viewBoxWidth + " " + this.mOption.viewBoxHeight;
			if(this.snap){
				this.snap.attr({
					viewBox:viewBox
				});
			}
		};

		BasicRender.prototype.onResize = function(width,height){
			this.mOption.width = width;
			this.mOption.height = height;
			if(this.snap){
				this.snap.attr({
					width:width,
					height:height
				});
			}
			if(this.afterResize){
				this.afterResize();
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
			this.shapeType = this.supportShape[type].name;
			this.sb = sb;

			this.onLoadSvg();
			if(this.supportShape[type].viewBox === true){
				this.setDefaultViewBox();
			}
		}
		LazyRender.prototype = new BasicRender();
		LazyRender.prototype.supportShape = {
			star:{//五角星
				name:'star',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m1.78,57.59944l55.66693,0l17.20151,-55.76719l17.20152,55.76719l55.66692,0l-45.03541,34.46562l17.2024,55.76719l-45.03543,-34.46656l-45.03542,34.46656l17.2024,-55.76719l-45.03542,-34.46562z"/>' +
				'</svg>'
			},
			trapezoid:{//梯形
				name:'trapezoid',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
					'<path d="m1,147.99999l27.9375,-146l93.12501,0l27.93749,146l-149.00001,0z"/>' +
					'</svg>'
			},
			arrowright:{//右箭头
				name:'arrowright',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m68.30813,120.24734l23.14807,-27.68181l-44.75567,0l-44.75557,0l0,-17.13635l0,-17.13637l44.24213,0c24.33314,0 44.2421,-0.86855 44.2421,-1.93012c0,-1.06155 -9.68695,-13.51837 -21.52652,-27.68181l-21.52659,-25.75171l19.89715,0l19.89707,0l30.38734,36.28472l30.38732,36.28471l-30.44561,36.21528l-30.4456,36.21528l-20.94686,0l-20.9469,0l23.14813,-27.68182l0.00001,0.00001z"/>' +
				'</svg>'
			},
			triangleright:{//直角三角形
				name:'triangleright',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m1.48501,148.39534l0,-147.39534l147.99999,147.39534l-147.99999,0z"/>' +
				'</svg>'
			},
			plus:{
				name:'plus',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m1.00499,49.91751l48.91252,0l0,-48.91252l50.17496,0l0,48.91252l48.91252,0l0,50.17496l-48.91252,0l0,48.91252l-50.17496,0l0,-48.91252l-48.91252,0l0,-50.17496z"/>' +
				'</svg>'
			},
			subtraction:{
				name:'subtraction',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m1.12676,53.28901l147.71831,0l0,43l-147.71831,0l0,-43z"/>' +
				'</svg>'
			},
			multiple:{
				name:'multiple',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m1.42029,37.63501l35.71028,-35.64001l37.93448,37.85952l37.93448,-37.85952l35.71062,35.64001l-37.93449,37.85983l37.93449,37.85983l-35.71062,35.64034l-37.93448,-37.85984l-37.93448,37.85984l-35.71028,-35.64034l37.93417,-37.85983l-37.93417,-37.85983z"/>' +
				'</svg>'
			},
			division:{
				name:'division',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m74.59414,1.97999l0,0c13.81745,0 25.01872,10.05901 25.01872,22.46742c0,12.40842 -11.20126,22.46742 -25.01872,22.46742c-13.81747,0 -25.01872,-10.05899 -25.01872,-22.46742c0,-12.40841 11.20124,-22.46742 25.01872,-22.46742zm0,146.00001c-13.81747,0 -25.01872,-10.059 -25.01872,-22.46742c0,-12.40841 11.20124,-22.46742 25.01872,-22.46742c13.81745,0 25.01872,10.059 25.01872,22.46742c0,12.40842 -11.20126,22.46742 -25.01872,22.46742zm-73.57447,-95.46742l147.14893,0l0,44.93484l-147.14893,0l0,-44.93484z"/>' +
				'</svg>'
			},
			equal:{
				name:'equal',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<g><path d="m1.12676,7.51123l147.71831,0l0,43l-147.71831,0l0,-43z"/><path d="m1.12676,99.9063l147.71831,0l0,43l-147.71831,0l0,-43z"/></g>' +
				'</svg>'
			},
			morethan:{
				name:'morethan',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m2 0 l148 75 l-148 75 l0 -30 l90 -45 -90 -45z"/>' +
				'</svg>'
			},
			lessthan:{
				name:'lessthan',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m148 0 l-148 75 l148 75 l0 -30 l-90 -45 l90 -45z"/>' +
				'</svg>'
			},
			lessequal:{
				name:'lessequal',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<g><path d="m148 0 l-148 75 l148 75 l0 -30 l-90 -45 l90 -45z"/><path d="m2 85 l130 63 l-45 0 l-85 -40z"/></g>' +
				'</svg>'
			},
			moreequal:{
				name:'moreequal',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<g><path d="m2 0 l148 75 l-148 75 l0 -30 l90 -45 -90 -45z"/><path d="m148 85 l-130 63 l45 0 l85 -40z"/></g>' +
				'</svg>'
			},
			parallelogram:{
				name:'parallelogram',
				str:'<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="m75,2l-73,146l73,0l73,-146l-73,0z"/>' +
				'</svg>'
			}
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

			this.mOption.isRendered++;
			var svg = Snap.parse(this.supportShape[shape].str);
			this.sb.mOption.wrap.appendChild(svg.node);
			var snap = Snap(svg.node);
			this.snap = snap;
			var snapWidth = snap.asPX("width");
			var snapHeight = snap.asPX("height");
			this.mOption.width = this.sb.mOption.width;
			this.mOption.height = this.sb.mOption.height;
			this.mInstance = snap.selectAll("path").attr(this.defaultAttr);
			this.mOption.isRendered++;
			if(snapWidth != this.mOption.width || snapHeight != this.mOption.height){
				this.onResize(this.mOption.width,this.mOption.height);
			}
		};

		LazyRender.prototype.afterResize = function(){
			if(this.mInstance && this.mInstance.type === "set"){
				var self = this;
				this.mInstance.forEach(function(element,index){
					if(element.transform){
						var widthRatio = self.mOption.width/self.mOption.viewBoxWidth;
						var heightRatio = self.mOption.height/self.mOption.viewBoxHeight;
						var m = new Snap.Matrix();
						m.scale(widthRatio,heightRatio);
						element.transform(m);
					}
				});
			}
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
				var attr = {
					cx:cx,
					cy:cy,
					r:r
				};
				this.mInstance.attr(attr);
				if(this.o.c){
					attr.r = this.o.r;
					this.o.c.attr(attr);//圆心
				}
			}
			this.mOption.isRendered++;
		};
		Circle.prototype.afterResize = function(){
			if(this.mInstance && this.mInstance.transform){
				this.o.x = this.mOption.width/2,this.o.y = this.mOption.height/2;
				this.onDraw();
			}
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
			//this.setDefaultViewBox();
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

		Rectangle.prototype.afterResize = function(){
			this.onDraw();
		};

		Rectangle.prototype.onDraw = function(){
			this.mOption.isRendered++;
			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;

			var x = this.defaultAttr.strokeWidth/2,
				y=this.defaultAttr.strokeWidth/2;
			var	width = clientWidth - this.defaultAttr.strokeWidth,
				height = clientHeight - this.defaultAttr.strokeWidth;

			if(this.mOption.isRendered === 0) {//初次渲染ly
				this.mInstance = this.snap.rect(x,y,width,height).attr(this.defaultAttr);
			}else{//二次渲染
				this.mInstance.attr({
					x:x,
					y:y,
					width:width,
					height:height
				});
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

		/************************七巧板子图渲染工具start***************************/

		function Sevenpiece(sb,type){
			this.super();
			this.shapeType = type;

			var snap = Snap(sb.mOption.width,sb.mOption.height);
			var svg = snap.node;
			sb.mOption.wrap.appendChild(svg);

			this.snap = snap;
			this.mOption.width = snap.asPX("width");
			this.mOption.height = snap.asPX("height");
			this.onDraw();
		}

		Sevenpiece.prototype = new BasicRender();

		/**
		 * 清空
		 */
		Sevenpiece.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
		};

		Sevenpiece.prototype.afterResize = function(){
			this.onDraw();
		};

		Sevenpiece.prototype.onDraw = function(){
			this.mOption.isRendered++;

			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;
			var	strokeWidth = this.defaultAttr.strokeWidth;
			var path;
			if(this.buildPath[this.shapeType]){
				path = this.buildPath[this.shapeType].call(this,clientWidth,clientHeight,strokeWidth);
			}
			if(path){
				if(this.mOption.isRendered === 0) {//初次渲染
					this.mInstance = this.snap.path(path).attr(this.defaultAttr);
				}else{//二次渲染
					this.mInstance.attr({
						d:path
					});
				}
				this.mOption.isRendered++;
			}
		};
		Sevenpiece.prototype.buildPath = {
			sevenpiece_sub1:function(clientWidth,clientHeight,strokeWidth){
				var path;
				if(clientWidth > clientHeight){
					throw new Error("传入的宽高值无法画出图形");
				}
				path = "m " + strokeWidth + " " + 0;
				path += " l 0 " + clientHeight;
				path += " l " + (clientWidth - strokeWidth) + " " + (-clientHeight/2);
				path += " z";
				return path;
			},
			sevenpiece_sub2:function(clientWidth,clientHeight,strokeWidth){
				var path;
				if(clientWidth < clientHeight){
					throw new Error("传入的宽高值无法画出图形");
				}
				path = "m 0 "  + strokeWidth;
				path += " l " + (clientWidth/2) + " " + (clientHeight - strokeWidth);
				path += " l " + (clientWidth/2) + " " + (-clientHeight + strokeWidth);
				path += " z";
				return path;
			},
			sevenpiece_sub3:function(clientWidth,clientHeight,strokeWidth){
				var path;
				if(clientWidth < clientHeight){
					throw new Error("传入的宽高值无法画出图形");
				}
				path = "m "  + (clientHeight) + " " + strokeWidth;
				path += " l " + (clientWidth - clientHeight) + " 0";
				path += " l " + (-clientHeight) + " " + (clientHeight - strokeWidth*2);
				path += " l " + (-clientWidth + clientHeight) + " 0";
				path += " z";
				return path;
			},
			sevenpiece_sub4:function(clientWidth,clientHeight,strokeWidth){
				var path;
				if(clientWidth < clientHeight){
					throw new Error("传入的宽高值无法画出图形");
				}
				path = "m "  + (clientWidth/2) + " 0";
				path += " l " + (-clientWidth/2) + " " + (clientHeight-strokeWidth);
				path += " l " + (clientWidth) + " 0";
				path += " z";
				return path;
			},
			sevenpiece_sub5:function(clientWidth,clientHeight,strokeWidth){
				var path;
				if(clientWidth != clientHeight){
					throw new Error("传入的宽高值无法画出图形");
				}
				path = "m "  + (clientWidth/2) + " 0";
				path += " l " + (-clientWidth/2) + " " + (clientHeight/2);
				path += " l " + (clientWidth/2) + " " + (clientHeight/2);
				path += " l " + (clientWidth/2) + " " + (-clientHeight/2);
				path += " z";
				return path;
			},
			sevenpiece_sub6:function(clientWidth,clientHeight,strokeWidth){
				var path;
				if(clientWidth > clientHeight){
					throw new Error("传入的宽高值无法画出图形");
				}
				path = "m "  + (clientWidth-strokeWidth) + " 0";
				path += " l " + (-clientWidth+strokeWidth) + " " + (clientHeight/2);
				path += " l " + (clientWidth-strokeWidth) + " " + (clientHeight/2);
				path += " z";
				return path;
			},
			sevenpiece_sub7:function(clientWidth,clientHeight,strokeWidth){
				var path;
				if(clientWidth != clientHeight){
					throw new Error("传入的宽高值无法画出图形");
				}
				path = "m "  + (clientWidth-strokeWidth) + " 0";
				path += " l " + (-clientWidth+strokeWidth) + " " + (clientHeight-strokeWidth);
				path += " l " + (clientWidth-strokeWidth) + " 0";
				path += " z";
				return path;
			}
		};
		renders["sevenpiece"] = Sevenpiece;
		/************************七巧板子图渲染工具end***************************/

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

		/************************右箭头渲染工具start***************************/
		function Arrow(sb,type){
			this.super();
			this.shapeType = type;

			var snap = Snap(sb.mOption.width,sb.mOption.height);
			var svg = snap.node;
			sb.mOption.wrap.appendChild(svg);

			this.snap = snap;
			this.mOption.width = snap.asPX("width");
			this.mOption.height = snap.asPX("height");
			this.onDraw();
		}
		Arrow.prototype = new BasicRender();

		/**
		 * 清空
		 */
		Arrow.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
		};

		Arrow.prototype.afterResize = function(){
			this.onDraw();
		};

		Arrow.prototype.onDraw = function(){
			this.mOption.isRendered++;

			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;
			var	strokeWidth = this.defaultAttr.strokeWidth;
			var path;
			if(this.buildPath[this.shapeType]){
				path = this.buildPath[this.shapeType].call(this,clientWidth,clientHeight,strokeWidth);
			}
			if(path){
				if(this.mOption.isRendered === 0) {//初次渲染
					this.mInstance = this.snap.path(path).attr(this.defaultAttr);
				}else{//二次渲染
					this.mInstance.attr({
						d:path
					});
				}
				this.mOption.isRendered++;
			}
		};
		Arrow.prototype.buildPath = {
			arrowright:function(clientWidth,clientHeight,strokeWidth){
				var path;
				path = "m " + strokeWidth + " " + (clientHeight/3);
				path += " l " + (clientWidth - clientHeight/3) + " 0";
				path += " l 0 " + (-clientHeight /3 + strokeWidth);
				path += " l " + (clientHeight /3 - strokeWidth*2) + " " + (clientHeight/2 - strokeWidth);
				path += " l " + (-clientHeight /3 + strokeWidth*2) + " " + (clientHeight/2 - strokeWidth);
				path += " l 0 " + (-clientHeight/3 + strokeWidth);
				path += " l " + (clientHeight/3 - clientWidth) + " 0";
				path += " z";
				return path;
			},
			arrowleft:function(clientWidth,clientHeight,strokeWidth){
				var path;
				path = "m " + strokeWidth + " " + (clientHeight/2);
				path += " l " + (clientHeight/3) + " " + (-clientHeight/2 + strokeWidth);
				path += " l 0 " + (clientHeight /3 - strokeWidth);
				path += " l " + (clientWidth - clientHeight/3 - strokeWidth*2) + " 0";
				path += " l 0 " + (clientHeight/3);
				path += " l " + (-clientWidth + clientHeight/3 + strokeWidth*2) + " 0";
				path += " l 0 " + (clientHeight/3 - strokeWidth*2);
				path += " z";
				return path;
			},
			arrowup:function(clientWidth,clientHeight,strokeWidth){
				var path;
				path = "m " + strokeWidth + " " + (clientWidth/3);
				path += " l " + (clientWidth/2 - strokeWidth) + " " + (-clientWidth/3 + strokeWidth);
				path += " l " + (clientWidth/2 - strokeWidth) + " " + (clientWidth/3 - strokeWidth);
				path += " l " + (-clientWidth/3) + " 0";
				path += " l 0 " + (clientHeight - clientWidth/3 - strokeWidth);
				path += " l " + (-clientWidth/3) + " 0";
				path += " l 0 " + (-clientHeight + clientWidth/3 + strokeWidth);
				path += " z";
				return path;
			},
			arrowdown:function(clientWidth,clientHeight,strokeWidth){
				var path;
				path = "m " + strokeWidth + " " + (clientHeight - clientWidth/3);
				path += " l " + (clientWidth/3 - strokeWidth) + " 0";
				path += " l 0 " + (-clientHeight + clientWidth/3 + strokeWidth);
				path += " l " + (clientWidth/3) + " 0";
				path += " l 0 " + (clientHeight - clientWidth/3 - strokeWidth);
				path += " l " + (clientWidth/3 - strokeWidth) + " 0";
				path += " l " + (-clientWidth/2 + strokeWidth) + " " + (clientWidth/3 - strokeWidth);
				path += " z";
				return path;
			},
			arrowdouble:function(clientWidth,clientHeight,strokeWidth){
				var path;
				path = "m " + strokeWidth + " " + (clientHeight/2);
				path += " l " + (clientHeight/3) + " " + (-clientHeight/2 + strokeWidth);
				path += " l 0 " + (clientHeight /3 - strokeWidth);
				path += " l " + (clientWidth - clientHeight*2/3 - strokeWidth*2) + " 0";
				path += " l 0 " + (-clientHeight/3);
				path += " l " + (clientHeight/3) + " " + (clientHeight/2);
				path += " l " + (-clientHeight/3) + " " + (clientHeight/2);
				path += " l 0 " + (-clientHeight/3);
				path += " l " + (-clientWidth + clientHeight*2/3 + strokeWidth*2) + " 0";
				path += " l 0 " + (clientHeight /3 - strokeWidth);
				path += " z";
				return path;
			}
		};
		renders["arrow"] = Arrow;
		/************************右箭头渲染工具end***************************/

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

		/************************直线渲染工具start***************************/
		function Line(sb,type){
			this.super();
			this.shapeType = type;

			var snap = Snap(sb.mOption.width,sb.mOption.height);
			var svg = snap.node;
			sb.mOption.wrap.appendChild(svg);

			this.line = {
				x1:0,
				y1:0,
				x2:0,
				y2:0,
				terminal:{
					start:{
						x:0,
						y:0,
						c:null
					},
					end:{
						x:0,
						y:0,
						c:null
					}
				}
			};

			this.snap = snap;
			this.mOption.width = snap.asPX("width");
			this.mOption.height = snap.asPX("height");

			//对水平线和竖直线做一些处理
			if(type == "linehorizontal"){
				//设置svg宽高
				this.snap.attr({
					width:this.mOption.width,
					height:this.defaultAttr.strokeWidth*4
				});
				this.line.x1 = this.defaultAttr.strokeWidth;
				this.line.x2 = this.mOption.width-this.defaultAttr.strokeWidth;

				this.line.y1 = this.defaultAttr.strokeWidth;
				this.line.y2 = this.defaultAttr.strokeWidth;
			}else if(type == "linevertical"){
                //设置svg宽高
				this.snap.attr({
					width:this.defaultAttr.strokeWidth*4,
					height:this.mOption.height
				});
				this.line.x1 = this.defaultAttr.strokeWidth;
				this.line.x2 = this.defaultAttr.strokeWidth;

				this.line.y1 = this.defaultAttr.strokeWidth;
				this.line.y2 = this.mOption.height-this.defaultAttr.strokeWidth;
			}

			this.onDraw();
		}
		Line.prototype = new BasicRender();

		/**
		 * 清空
		 */
		Line.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
		};

		Line.prototype.onDraw = function(){
			this.mOption.isRendered++;
			var x1 = this.line.x1,
				y1 = this.line.y1,
				x2 = this.line.x2,
				y2 = this.line.y2;
			var terminalAttr = {
				"fill-opacity":this.shapeType == "linesegment"?1:0
			};

			if(this.shapeType == "dashline"){//如果是虚线
				this.defaultAttr["stroke-dasharray"] = this.defaultAttr.strokeWidth*2 + "," + this.defaultAttr.strokeWidth*2;
			}

			if(this.mOption.isRendered === 0) {//初次渲染
				this.mInstance = this.snap.line(x1,y1,x2,y2).attr(this.defaultAttr);

				if(x1 != x2 || y1 != y2){//只要长度不为0,就要画端点
					this.line.terminal.start.x = x1,this.line.terminal.start.y = y1;
					this.line.terminal.end.x = x2,this.line.terminal.end.y = y2;
					this.line.terminal.start.c = this.snap.circle(this.line.terminal.start.x,this.line.terminal.start.y,this.defaultAttr.strokeWidth*2).attr(terminalAttr);
					this.line.terminal.end.c = this.snap.circle(this.line.terminal.end.x,this.line.terminal.end.y,this.defaultAttr.strokeWidth*2).attr(terminalAttr);
					this.line.terminal.start.c.attr({"key":"start"});
					this.line.terminal.end.c.attr({"key":"end"});
				}
			}else{//二次渲染
				if(this.mInstance){
					this.mInstance.attr({
						x1:x1,
						y1:y1,
						x2:x2,
						y2:y2
					});
				}
				if(x1 != x2 || y1 != y2){//只要长度不为0,就要画端点
					this.line.terminal.start.x = x1,this.line.terminal.start.y = y1;
					this.line.terminal.end.x = x2,this.line.terminal.end.y = y2;
					var terminalRadius = this.defaultAttr.strokeWidth*3/2;
					if(this.line.terminal.start.c){
						this.line.terminal.start.c.attr({
							cx:this.line.terminal.start.x,
							cy:this.line.terminal.start.y,
							r:terminalRadius
						});
					}else{
						this.line.terminal.start.c = this.snap.circle(this.line.terminal.start.x,this.line.terminal.start.y,terminalRadius).attr(terminalAttr);
					}
					if(this.line.terminal.end.c){
						this.line.terminal.end.c.attr({
							cx:this.line.terminal.end.x,
							cy:this.line.terminal.end.y,
							r:terminalRadius
						});
					}else{
						this.line.terminal.end.c = this.snap.circle(this.line.terminal.end.x,this.line.terminal.end.y,terminalRadius).attr(terminalAttr);
					}
				}
			}
			this.mOption.isRendered++;
		};
		Line.prototype.onRefresh = function(x1,y1,x2,y2){
			var w = Math.abs(x1 - x2),h = Math.abs(y1 - y2);
			this.snap.attr({
				width:w===0?this.defaultAttr.strokeWidth*4:w,
				height:h===0?this.defaultAttr.strokeWidth*4:h
			});
			if(x2 > x1){
				this.line.x1 = this.defaultAttr.strokeWidth;
				this.line.x2 = w - this.defaultAttr.strokeWidth;
			}else if(x1 == x2){
				this.line.x1 = this.defaultAttr.strokeWidth*2;
				this.line.x2 = this.defaultAttr.strokeWidth*2;
			}else{
				this.line.x1 = w - this.defaultAttr.strokeWidth;
				this.line.x2 = this.defaultAttr.strokeWidth;
			}

			if(y2 > y1){
				this.line.y1 = this.defaultAttr.strokeWidth;
				this.line.y2 = h - this.defaultAttr.strokeWidth;
			}else if(y1 == y2){
				this.line.y1 = this.defaultAttr.strokeWidth*2;
				this.line.y2 = this.defaultAttr.strokeWidth*2;
			}else{
				this.line.y1 = h - this.defaultAttr.strokeWidth;
				this.line.y2 = this.defaultAttr.strokeWidth;
			}
			this.onDraw();
		};
		renders[supportShape.line] = Line;
		/************************直线渲染工具end************************linesegment***/
		
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
			//this.setDefaultViewBox();
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
		Triangle.prototype.afterResize = function(){
			this.onDraw();
		};
		Triangle.prototype.onDraw = function(){
			
			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;
			var path;

			this.mPoint.p1.x = clientWidth/2,this.mPoint.p1.y = this.mOption.pointSize*2,
				this.mPoint.p2.x = this.mOption.pointSize*2-clientWidth/2,this.mPoint.p2.y = clientHeight-this.mOption.pointSize-this.defaultAttr.strokeWidth,
				this.mPoint.p3.x = clientWidth-this.mOption.pointSize*2,this.mPoint.p3.y = 0,
				this.mPoint.p1.r = this.mPoint.p2.r = this.mPoint.p3.r = this.mOption.pointSize+1;
			path = "m" + this.mPoint.p1.x + " " + this.mPoint.p1.y + " l" + this.mPoint.p2.x + " " + this.mPoint.p2.y + " l" + this.mPoint.p3.x + " " + this.mPoint.p3.y + "z";

			this.mOption.isRendered++;
			if(this.mOption.isRendered === 0){//初次渲染
				//绘制三角形
				this.mInstance = this.snap.path(path).attr(this.defaultAttr);
			}else{//二次渲染
				//绘制三角形
				this.mInstance.attr("d",path);
			}
			this.mOption.isRendered++;
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

			sb.mOption.wrap.style.position = "relative";

			this.shapeType = supportShape.sevenpiecepuzzle;

			this.createSubs(sb.mOption.wrap);

			//this.setDefaultViewBox();
			this.subGraph = {//定义7个子图
				sub0:{
					points:[
						{
							x:0,
							y:0
						},
						{
							x:0,
							y:sb.mOption.height
						},
						{
							x:sb.mOption.width/2,
							y:-sb.mOption.height/2
						}
					],
					left:0,
					top:0,
					width:sb.mOption.width/2,
					height:sb.mOption.height,
					oriWidth:sb.mOption.width/2,
					oriHeight:sb.mOption.height,
					fill:"#008000",
					wrap:sb.mOption.wrap.children[0],
					c:null,
					snap:null
				},
				sub1:{
					points:[
						{
							x:0,
							y:0
						},
						{
							x:sb.mOption.width,
							y:0
						},
						{
							x:-sb.mOption.width/2,
							y:sb.mOption.height/2
						}
					],
					left:0,
					top:0,
					width:sb.mOption.width,
					height:sb.mOption.height/2,
					oriWidth:sb.mOption.width,
					oriHeight:sb.mOption.height/2,
					fill:"#0000ff",
					wrap:sb.mOption.wrap.children[1],
					c:null,
					snap:null
				},
				sub2:{
					points:[
						{
							x:0,
							y:sb.mOption.height/4
						},
						{
							x:sb.mOption.width/4,
							y:-sb.mOption.height/4
						},
						{
							x:sb.mOption.width/2,
							y:0
						},
						{
							x:-sb.mOption.width/4,
							y:sb.mOption.height/4
						}
					],
					left:0,
					top:sb.mOption.height*3/4,
					width:sb.mOption.width*3/4,
					height:sb.mOption.height/4,
					oriWidth:sb.mOption.width*3/4,
					oriHeight:sb.mOption.height/4,
					fill:"#ff0080",
					wrap:sb.mOption.wrap.children[2],
					c:null,
					snap:null
				},
				sub3:{
					points:[
						{
							x:0,
							y:sb.mOption.height/4
						},
						{
							x:sb.mOption.width/4,
							y:-sb.mOption.height/4
						},
						{
							x:sb.mOption.width/4,
							y:sb.mOption.height/4
						}
					],
					left:sb.mOption.width/4,
					top:sb.mOption.height/2,
					width:sb.mOption.width/2,
					height:sb.mOption.height/4,
					oriWidth:sb.mOption.width/2,
					oriHeight:sb.mOption.height/4,
					fill:"#00ff00",
					wrap:sb.mOption.wrap.children[3],
					c:null,
					snap:null
				},
				sub4:{
					points:[
						{
							x:0,
							y:sb.mOption.height/4
						},
						{
							x:sb.mOption.width/4,
							y:-sb.mOption.height/4
						},
						{
							x:sb.mOption.width/4,
							y:sb.mOption.height/4
						},
						{
							x:-sb.mOption.width/4,
							y:sb.mOption.height/4
						}
					],
					left:sb.mOption.width/2,
					top:sb.mOption.height/4,
					width:sb.mOption.width/2,
					height:sb.mOption.height/2,
					oriWidth:sb.mOption.width/2,
					oriHeight:sb.mOption.height/2,
					fill:"#ff8040",
					wrap:sb.mOption.wrap.children[4],
					c:null,
					snap:null
				},
				sub5:{
					points:[
						{
							x:0,
							y:sb.mOption.height/4
						},
						{
							x:sb.mOption.width/4,
							y:-sb.mOption.height/4
						},
						{
							x:0,
							y:sb.mOption.height/2
						}
					],
					left:sb.mOption.width*3/4,
					top:0,
					width:sb.mOption.width/4,
					height:sb.mOption.height/2,
					oriWidth:sb.mOption.width/4,
					oriHeight:sb.mOption.height/2,
					fill:"#804000",
					wrap:sb.mOption.wrap.children[5],
					c:null,
					snap:null
				},
				sub6:{
					points:[
						{
							x:0,
							y:sb.mOption.height/2
						},
						{
							x:sb.mOption.width/2,
							y:-sb.mOption.height/2
						},
						{
							x:0,
							y:sb.mOption.height/2
						}
					],
					left:sb.mOption.width/2,
					top:sb.mOption.height/2,
					width:sb.mOption.width/2,
					height:sb.mOption.height/2,
					oriWidth:sb.mOption.width/2,
					oriHeight:sb.mOption.height/2,
					fill:"#ffff80",
					wrap:sb.mOption.wrap.children[6],
					c:null,
					snap:null
				}
			};
			this.children = [];
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
		Sevenpiecepuzzle.prototype.createSubs = function(wrap){
			var child;
			while(wrap.hasChildNodes()){//先删除所有子节点
				wrap.removeChild(wrap.firstChild);
			}
			for(var i=0; i<7; i++){
				child = document.createElement("div");
				child.className = "sub-sevenpiecepuzzle";
				wrap.appendChild(child);
			}
		};

		/**
		 * 获取子块
		 */
		Sevenpiecepuzzle.prototype.getChildren = function(){
			if(this.children && this.children.length==7){
				return this.children;
			}
			var subGraph,ele,wrap,result = [];
			for(var sub in this.subGraph){
				ele = this.subGraph[sub].c;
				wrap = this.subGraph[sub].wrap;
				subGraph = new SubGraph(ele,wrap,this.subGraph[sub].snap);
				result.push(subGraph);
			}
			return result;
		};

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
			var c;
			for(var sub in this.subGraph){
				c = this.subGraph[sub].c;
				if(c && c.remove){
					c.remove();
				}
				c = null;
			}
		};

		Sevenpiecepuzzle.prototype.onDraw = function(){
			var clientWidth = this.mOption.width,
				clientHeight = this.mOption.height;

			this.mOption.isRendered++;
			if(this.mOption.isRendered === 0){//初次渲染
				//绘制外框
				this.defaultAttr.fill = "#fff";
				this.mInstance = {};

				//绘制小图形
				var path, s, i,len, p,snap,svg;
				for(var sub in this.subGraph){
					s = this.subGraph[sub];

					snap = Snap(s.width,s.height);
					svg = snap.node;
					s.wrap.style.position = "absolute";
					s.wrap.style.left = s.left + "px";
					s.wrap.style.top = s.top + "px";
					s.wrap.appendChild(svg);
					s.snap = snap;

					path = "m ";
					if(s.points instanceof Array){
						for(i=0,len = s.points.length; i<len; i++){
							p = s.points[i];
							if(i>0){
								path += " l";
							}
							path += p.x + " " + p.y;
						}
						path += "z";
					}
					this.defaultAttr.fill = s.fill;
					this.defaultAttr.key = sub;
					s.c = snap.path(path).attr(this.defaultAttr);
					s.c.addClass("pointevent_auto");
					s.c.attr({oriWidth:s.width,oriHeight: s.height});
					this.children.push(new SubGraph(s.c,s.wrap,snap));
					s.c.mousedown(this.innerEvent.actionStart,this).touchstart(this.innerEvent.actionStart,this)
						.touchmove(this.innerEvent.actionMove,this).touchend(this.innerEvent.actionEnd,this);
				}
			}else{//二次渲染
			}
			this.mOption.isRendered++;
		};
		Sevenpiecepuzzle.prototype.innerEvent = {
			targetSubGraph:null,
			shadowClass:"svgDragShadow",
			actionStart:function(ev){//mousedown,touchstart
				var target = ev.target;
				var x = ev.clientX?ev.clientX:ev.touches[0].clientX,y = ev.clientY?ev.clientY:ev.touches[0].clientY;
				var key = target.getAttribute("key");
				var subGraph;
				if(key.length > 0){
					var index = parseInt(key.substring("sub".length));
					subGraph = this.children[index];
					var l = parseFloat(subGraph.mWrap.style.left),t = parseFloat(subGraph.mWrap.style.top);
					target.setAttribute("startLeft",l);
					target.setAttribute("startTop",t);
					subGraph.mWrap.style.zIndex = "10";
				}
				target.setAttribute("action","true");
				target.setAttribute("actionStartX",x);
				target.setAttribute("actionStartY",y);

				if(ev.type == "mousedown"){
					var shadow = createShadow(this);//创建全屏遮罩，监听后续事件
					this.innerEvent.targetSubGraph = subGraph;
					shadow.addEventListener("mousemove",this.innerEvent.actionMove.bind(this));
					shadow.addEventListener("mouseup",this.innerEvent.actionEnd.bind(this));
				}

				function createShadow(context){
					var shadow = document.createElement("div");
					shadow.className = context.innerEvent.shadowClass;
					shadow.style.position = "fixed";
					shadow.style.width = "100%";
					shadow.style.height = "100%";
					shadow.style.zIndex = "9999";
					var body = document.querySelector("body");
					body.appendChild(shadow);
					return shadow;
				}
			},
			actionMove:function(ev){
				var isMouseEvent = (ev instanceof MouseEvent)?true:false;
				var target = isMouseEvent?this.innerEvent.targetSubGraph.mElement.node:ev.target;

				var x = ev.clientX?ev.clientX:ev.touches[0].clientX,y = ev.clientY?ev.clientY:ev.touches[0].clientY;
				var action = target.getAttribute("action");
				var key = target.getAttribute("key");
				if(action === "true" && key.length > 0){
					var index = parseInt(key.substring("sub".length));
					var subGraph = this.children[index];
					if(subGraph && subGraph.move){
						var actionStartX = parseFloat(target.getAttribute("actionStartX"));
						var actionStartY = parseFloat(target.getAttribute("actionStartY"));
						var startLeft = parseFloat(target.getAttribute("startLeft"));
						var startTop = parseFloat(target.getAttribute("startTop"));
						var targetLeft = x-actionStartX + startLeft;
						var targetTop = y-actionStartY + startTop;
						subGraph.mWrap.style.left = targetLeft + "px";
						subGraph.mWrap.style.top = targetTop + "px";
						subGraph.move(x-actionStartX,y-actionStartY);
					}
				}
			},
			actionEnd:function(ev){
				var isMouseEvent = (ev instanceof MouseEvent)?true:false;
				var target = isMouseEvent?this.innerEvent.targetSubGraph.mElement.node:ev.target;

				target.removeAttribute("action");
				target.removeAttribute("startLeft");
				target.removeAttribute("startTop");
				target.removeAttribute("actionStartX");
				target.removeAttribute("actionStartY");

				if(isMouseEvent){
					removeShadow(this);
				}

				function removeShadow(context){
					var shadow = document.querySelector("." + context.innerEvent.shadowClass);
					var body = document.querySelector("body");
					shadow.removeEventListener("mousemove",context.innerEvent.actionMove.bind(this));
					shadow.removeEventListener("mouseup",context.innerEvent.actionEnd.bind(this));
					body.removeChild(shadow);
				}
			}
		};
		renders[supportShape.sevenpiecepuzzle] = Sevenpiecepuzzle;
		/************************七巧板渲染工具end***************************/

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

		/************************半圆渲染工具start***************************/
		function Halfcircle(sb){
			this.super();
			this.shapeType = supportShape.halfcircle;

			var snap = Snap(sb.mOption.width,sb.mOption.height);
			var svg = snap.node;
			sb.mOption.wrap.appendChild(svg);

			this.snap = snap;
			//this.setDefaultViewBox();//不需要等比缩放
			this.mOption.width = snap.asPX("width");
			this.mOption.height = snap.asPX("height");
			this.onDraw();
		}
		Halfcircle.prototype = new BasicRender();

		/**
		 * 清空
		 */
		Halfcircle.prototype.clearAll = function(){
			if(this.mInstance){
				this.mInstance.remove();
			}
		};

		Halfcircle.prototype.onDraw = function(){
			this.mOption.isRendered++;

			var path;
			var width = this.mOption.width,height = this.mOption.height;
			if(this.mOption.isRendered === 0) {//初次渲染
				path = "m " + this.defaultAttr.strokeWidth/2 + " " + this.defaultAttr.strokeWidth/2;//起点
				path += " a ";
				path += (width-this.defaultAttr.strokeWidth*2) + " ";//长半轴
				path += (height - this.defaultAttr.strokeWidth)/2 + " ";//短半轴
				path += "0 1 1" + " ";//旋转参数
				path += this.defaultAttr.strokeWidth/2 + " ";
				path += (height - this.defaultAttr.strokeWidth) + " ";
				path += "z";
				this.defaultAttr.fill = "#fff";
				this.mInstance = this.snap.path(path).attr(this.defaultAttr);
			}else{//二次渲染
				path = "m " + this.defaultAttr.strokeWidth/2 + " " + this.defaultAttr.strokeWidth/2;//起点
				path += " a ";
				path += (width-this.defaultAttr.strokeWidth*2) + " ";//长半轴
				path += (height - this.defaultAttr.strokeWidth)/2 + " ";//短半轴
				path += "0 1 1" + " ";//旋转参数
				path += this.defaultAttr.strokeWidth/2 + " ";
				path += (height - this.defaultAttr.strokeWidth) + " ";
				path += "z";
				this.defaultAttr.fill = "#fff";
				this.mInstance.attr({
					d:path
				});
			}
			this.mOption.isRendered++;
		};
		Halfcircle.prototype.afterResize = function(){
			this.onDraw();
		};
		renders[supportShape.halfcircle] = Halfcircle;
		/************************半圆渲染工具end***************************/

		/************************字块包装类start***************************/
		/**
		 * 字块包装类
		 * @param ele 对应的snap.svg 元素
		 * @param wrap 对应的dom元素
		 * @constructor
		 */
		function SubGraph(ele,wrap,snap){
			this.mElement = ele;
			this.mWrap = wrap;
			this.mSnap = snap;
		}
		SubGraph.prototype.fill = function(color){
			if(this.mElement){
				this.mElement.attr({
					fill:color
				});
			}
			return this;
		};
		SubGraph.prototype.stroke = function(color){
			if(this.mElement){
				this.mElement.attr({
					stroke:color
				});
			}
			return this;
		};
		SubGraph.prototype.getDom = function(){
			return this.mWrap;
		};
		SubGraph.prototype.setSize = function(width,height){
			if(this.mSnap){
				this.mSnap.attr({
					width:width,
					height:height
				});
			}
			if(this.mElement && this.mElement.transform){
				var oriWidth = this.mElement.asPX("oriWidth");
				var oriHeight = this.mElement.asPX("oriHeight");
				var widthRatio = width/oriWidth;
				var heightRatio = height/oriHeight;
				var m = new Snap.Matrix();
				m.scale(widthRatio,heightRatio);
				this.mElement.transform(m);
			}
		};

		/**
		 * onMove
		 * @param
		 */
		SubGraph.prototype.onMove = function(fn){
			if(fn && (typeof fn == "function")){
				this.moveCallback = fn;
			}
			return this;
		};
		SubGraph.prototype.move = function(translateX,translateY){
			if(this.moveCallback && (typeof this.moveCallback == "function")){
				this.moveCallback(translateX,translateY);
			}
			return this;
		};
		/************************字块包装类end***************************/
		return renders;
	})();
})(this);