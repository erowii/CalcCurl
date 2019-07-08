/// <reference path="createjs/easeljs.d.ts" />

namespace PageCurl{
	import Stage = createjs.Stage;
	import Container = createjs.Container;
	export class main{
		constructor(stage:Stage, lib_PokerCard:any){
			let pokerCurl:PokerCurl = new PokerCurl(lib_PokerCard);
			let pokerView:Container = pokerCurl.getView();
			pokerView.x = 220;
			pokerView.y = 150;
			pokerView.scale = 0.8;
			stage.addChild(pokerView);


			let pokerCurl2:PokerCurl = new PokerCurl(lib_PokerCard);
			let pokerView2:Container = pokerCurl2.getView();
			pokerView2.x = 520;
			pokerView2.y = 650;
			pokerView2.rotation = 90;
			pokerView2.scale = 0.8;
			stage.addChild(pokerView2);
		}
	}
}