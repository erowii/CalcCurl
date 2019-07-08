namespace PageCurl{
	export class CalcCurl{
		protected originPoint:Vector2;
		protected startPoint:Vector2;
		protected width:number;
		protected height:number;
		protected pageContainer:IDisplayObject;
		protected showPage:IDisplayObject;
		protected mask:IDisplayObject;

		constructor(width:number, height:number) {
			this.width = width;
			this.height = height;
			this.originPoint = new Vector2(0, 0);
		}

		public startClick = (v:Vector2)=>{
			this.startPoint = v;
		    this.calcCurl(this.startPoint);
		}

		public daggle = (v:Vector2)=>{
		    this.calcCurl(v);
		}

		//瞇牌座標、角度計算
		public calcCurl = (currPoint:Vector2)=>{
			let centerPoint:Vector2 = this.originPoint.centerVectorTo(currPoint);
			let offsetPoint:Vector2 = currPoint.clone().sub(this.originPoint);
    		let offsetRad = Math.atan2(offsetPoint.y, offsetPoint.x) * 180.0 / Math.PI;
    		let rotation:number = 2 * (offsetRad + 90);
    		this.displayObjectTransform(this.showPage, currPoint.x, currPoint.y, rotation, this.originPoint.x, this.height - this.originPoint.y);
    		this.displayObjectTransform(this.mask, centerPoint.x, centerPoint.y, rotation * 0.5);
		}

		private displayObjectTransform = (displayObject:IDisplayObject, x:number, y:number, rotation?:number, regX?:number, regY?:number)=>{
			displayObject.x = x;
			displayObject.y = y;
			displayObject.rotation = rotation || 0;
			displayObject.regX = regX || 0;
			displayObject.regY = regY || 0;
		}
	}
}