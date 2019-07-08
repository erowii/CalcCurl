/// <reference path="createjs/easeljs.d.ts" />

namespace PageCurl{
	import Container = createjs.Container;
	import MovieClip = createjs.MovieClip;
	import Rectangle = createjs.Rectangle;
	import Shape = createjs.Shape;
	import Point = createjs.Point;

	export class PokerCurl extends CalcCurl{
		private pokerContainer:Container = new Container();
		private pokerBack:Container;
		private poker:MovieClip;
		private pokerShadow:Shape;
		private lib_PokerCard:any;
		private hitAreas:Array<Rectangle>;
		private originPoints:Array<Vector2>
		
		private clickAreasName:Array<string> = ["leftTop", "rightTop", "leftBottom", "rightBottom", "top", "Bottom", "left", "right"];
		private debugLineSize:number = 5;
		private offsetX:number = 0;
		private offsetY:number = 0;

		constructor(lib_PokerCard:any){
			super(300, 458);
			this.lib_PokerCard = lib_PokerCard;
			this.initOriginPoints();
			this.initHitAresData();
			this.initCardContainer();
    		this.initPokerBack();
    		this.initPoker();
    		this.initPokerShadow()
    		this.initMask();
    		this.initHitAres();
		}

		private initOriginPoints = ()=>{
			this.originPoints = [
			    new Vector2(0, 0),
			    new Vector2(this.width, 0),
			    new Vector2(0, this.height),
			    new Vector2(this.width, this.height)
			];
		}

		private initHitAresData = ()=>{
			let areaSize:number = 50;
			this.hitAreas = [
			    new Rectangle(0, 0, areaSize, areaSize), //左上
			    new Rectangle(this.width, 0, -areaSize, areaSize), //右上
			    new Rectangle(0, this.height, areaSize, -areaSize), //左下
			    new Rectangle(this.width, this.height, -areaSize, -areaSize), //右下
			    new Rectangle(areaSize, 0, this.width - areaSize * 2, areaSize), //上
			    new Rectangle(areaSize, this.height, this.width - areaSize * 2, -areaSize), //下
			    new Rectangle(0, areaSize, areaSize, this.height - areaSize * 2), //左
			    new Rectangle(this.width, areaSize, -areaSize, this.height - areaSize * 2) //右
			];
		}

		private initCardContainer = ()=>{
			this.pageContainer = this.pokerContainer;
			// this.pageContainer.rotation = 90;
		}

		private initPokerBack = ()=>{
		    this.pokerBack = new this.lib_PokerCard.PokerBack();
		    this.pokerContainer.addChild(this.pokerBack);
		}

		private initPoker = ()=>{
		    this.poker = new this.lib_PokerCard.PokerCard();
		    this.poker.gotoAndStop(10);
		    this.poker.visible = false;
		    this.pokerBack.addChild(this.poker);
		    this.showPage = this.poker;
		}

		private initPokerShadow = ()=>{
			this.pokerShadow = new Shape();
			this.pokerShadow.graphics
        		.beginLinearGradientFill(["#000000", "rgba(0, 0, 0, 0)"], [0, 1], 0, 40, 0, -40)
				.drawRect(-this.width * 2, -40, this.width * 4, 40);
			this.pokerBack.addChild(this.pokerShadow);
			
			let pokerShadowMask:Shape = new Shape();
		    pokerShadowMask.graphics.beginFill("#ff0000").drawRoundRect(0, 0, this.width, this.height, 30);
		    this.pokerShadow.mask = pokerShadowMask;
		}

		private initMask = ()=>{
			let mask:Shape = new Shape();
			mask.graphics.setStrokeStyle(this.debugLineSize)
				.beginStroke("rgba(255,0,0,0.5)").beginFill("rgba(255,0,0,0.2)")
				.drawRect(-this.width * 2, -this.height * 1.5, this.width * 4, this.height * 1.5);
			this.mask = mask;
		}

		private initHitAres = ()=>{
			for (var i = 0; i < this.hitAreas.length; i++) {
		    	var clickShape:Shape = new Shape();
		    	var hitArea:Shape = this.createClickArea(this.hitAreas[i]);
		    	clickShape.hitArea = hitArea;
		    	clickShape.name = this.clickAreasName[i];
		    	clickShape.addEventListener("mousedown", this.onMouseDownHandle);
		    	clickShape.addEventListener("pressmove", this.onPressMoveHandle);
		    	clickShape.addEventListener("pressup", this.onPressUpHandle);
		        this.pokerContainer.addChild(clickShape);
			}
		}

		private createClickArea =(rect):Shape=> {
		    let shape = new Shape();
		    shape.graphics.beginFill("#FFFFFF").drawRect(rect.x, rect.y, rect.width, rect.height);
		    shape.alpha = 0.1;
		    return shape;
		}

		private setOriginPoint = (clickAreaName:string, localPoint:Vector2)=>{
			switch (clickAreaName) {
		        case "leftTop":
		            this.originPoint = this.originPoints[0].clone();
		            break;
		        case "rightTop":
		            this.originPoint = this.originPoints[1].clone();
		            break;
		        case "leftBottom":
		            this.originPoint = this.originPoints[2].clone();
		            break;
		        case "rightBottom":
		            this.originPoint = this.originPoints[3].clone();
		            break;
		        case "top":
		        	this.originPoint.y = 0;
		        	this.originPoint.x = localPoint.x - this.offsetX;
		            break;
		        case "Bottom":
		        	this.originPoint.y = this.height;
		        	this.originPoint.x = localPoint.x - this.offsetX;
		            break;
		        case "left":
		        	this.originPoint.x = 0;
		        	this.originPoint.y = localPoint.y - this.offsetY;
		            break;
		        case "right":
		        	this.originPoint.x = this.width;
		        	this.originPoint.y = localPoint.y - this.offsetY;
		            break;
		    }
		}

		private onMouseDownHandle = (evt)=>{
		    let localPoints:Point = this.pokerBack.globalToLocal(evt.stageX, evt.stageY);
		    let localPointsV2:Vector2 = new Vector2(localPoints.x, localPoints.y);

		    this.poker.gotoAndStop(Math.floor((Math.random() * 12)));
		    this.pokerBack.mask = <Shape>this.mask;
		    this.pokerShadow.visible = true;
		    this.poker.visible = true;
		    this.setOriginPoint(evt.target.name, localPointsV2);
		    this.startClick(localPointsV2)
		    this.updatePokerShadow();
		}

		private onPressMoveHandle = (evt)=>{
		    let localPoints:Point = this.pokerBack.globalToLocal(evt.stageX, evt.stageY);
		    this.offsetX = localPoints.x - this.startPoint.x;
		    this.offsetY = localPoints.y - this.startPoint.y;
    		this.daggle(new Vector2(this.startPoint.x + this.offsetX, this.startPoint.y + this.offsetY));
		    this.updatePokerShadow();
		}

		private onPressUpHandle = (evt)=>{
		    this.pokerBack.mask = null;
		    this.poker.visible = false;
		    this.pokerShadow.visible = false;
		    this.offsetX = this.offsetY = 0;
		}

		public updatePokerShadow = ()=>{
			this.pokerShadow.x = this.mask.x;
			this.pokerShadow.y = this.mask.y;
			this.pokerShadow.rotation = this.mask.rotation;

			this.pokerShadow.mask.x = this.poker.x;
			this.pokerShadow.mask.y = this.poker.y;
			this.pokerShadow.mask.rotation = this.poker.rotation;
			this.pokerShadow.mask.regX = this.poker.regX;
			this.pokerShadow.mask.regY = this.poker.regY;
		}

		public getView = ():Container=>{
			return this.pokerContainer;
		}
	}
}