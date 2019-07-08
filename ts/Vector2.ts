namespace PageCurl{
	export class Vector2{
		public x:number;
		public y:number;

		constructor(x:number, y:number) {
			this.x = x;
			this.y = y;
		}

		public add = (v:Vector2)=>{
			this.x += v.x;
			this.y += v.y;
			return this;
		}
		
		public sub = (v:Vector2)=>{
			this.x -= v.x;
			this.y -= v.y;
			return this;
		}
		
		public divide = (v:Vector2)=>{
			this.x /= v.x;
			this.y /= v.y;
			return this;
		}

		public rotateAround = (center:Vector2, angle:number)=>{
			var c = Math.cos( angle ), s = Math.sin( angle );
			var x = this.x - center.x;
			var y = this.y - center.y;
			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;
			return this;
		}

		public clamp = (min:Vector2, max:Vector2):Vector2=>{
			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			return this;
		}

		public angle = ():number=>{
			var angle = Math.atan2( this.y, this.x );
			if ( angle < 0 ) angle += 2 * Math.PI;
			return angle;
		}

		public centerVectorTo = (v:Vector2):Vector2=>{
			return new Vector2((this.x + v.x) / 2, (this.y + v.y) / 2);
		}

		public distanceTo = (v:Vector2):number=>{
			return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
		}

		public toString = ():String =>{
			return this.x + "," + this.y;
		}

		public set = (x:number, y:number):Vector2=>{
			this.x = x;
			this.y = y;
			return this;
		}

		public clone = ():Vector2 =>{
			return new Vector2(this.x, this.y);
		}
	}
}