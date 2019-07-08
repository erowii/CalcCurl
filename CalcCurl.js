var PageCurl;
(function (PageCurl) {
    class Vector2 {
        constructor(x, y) {
            this.add = (v) => {
                this.x += v.x;
                this.y += v.y;
                return this;
            };
            this.sub = (v) => {
                this.x -= v.x;
                this.y -= v.y;
                return this;
            };
            this.divide = (v) => {
                this.x /= v.x;
                this.y /= v.y;
                return this;
            };
            this.rotateAround = (center, angle) => {
                var c = Math.cos(angle), s = Math.sin(angle);
                var x = this.x - center.x;
                var y = this.y - center.y;
                this.x = x * c - y * s + center.x;
                this.y = x * s + y * c + center.y;
                return this;
            };
            this.clamp = (min, max) => {
                this.x = Math.max(min.x, Math.min(max.x, this.x));
                this.y = Math.max(min.y, Math.min(max.y, this.y));
                return this;
            };
            this.angle = () => {
                var angle = Math.atan2(this.y, this.x);
                if (angle < 0)
                    angle += 2 * Math.PI;
                return angle;
            };
            this.centerVectorTo = (v) => {
                return new Vector2((this.x + v.x) / 2, (this.y + v.y) / 2);
            };
            this.distanceTo = (v) => {
                return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
            };
            this.toString = () => {
                return this.x + "," + this.y;
            };
            this.clone = () => {
                return new Vector2(this.x, this.y);
            };
            this.x = x;
            this.y = y;
        }
    }
    PageCurl.Vector2 = Vector2;
})(PageCurl || (PageCurl = {}));
var PageCurl;
(function (PageCurl) {
    class CalcCurl {
        constructor(width, height) {
            this.devicePixelRatio = 1;
            this.startClick = (v) => {
                this.startPoint = v;
                this.calcCurl(this.startPoint);
            };
            this.daggle = (v) => {
                this.calcCurl(v);
            };
            //瞇牌座標、角度計算
            this.calcCurl = (currPoint) => {
                let centerPoint = this.originPoint.centerVectorTo(currPoint);
                let offsetPoint = currPoint.clone().sub(this.originPoint);
                let offsetRad = Math.atan2(offsetPoint.y, offsetPoint.x) * 180.0 / Math.PI;
                let rotation = 2 * (offsetRad + 90);
                this.displayObjectTransform(this.showPage, currPoint.x, currPoint.y, rotation, this.originPoint.x, this.height - this.originPoint.y);
                this.displayObjectTransform(this.mask, centerPoint.x, centerPoint.y, rotation * 0.5);
            };
            this.displayObjectTransform = (displayObject, x, y, rotation, regX, regY) => {
                displayObject.x = x;
                displayObject.y = y;
                displayObject.rotation = rotation || 0;
                displayObject.regX = regX || 0;
                displayObject.regY = regY || 0;
            };
            this.width = width;
            this.height = height;
            this.originPoint = new PageCurl.Vector2(0, 0);
            if (window.devicePixelRatio) {
                this.devicePixelRatio = window.devicePixelRatio;
            }
        }
    }
    PageCurl.CalcCurl = CalcCurl;
})(PageCurl || (PageCurl = {}));
/// <reference path="createjs/easeljs.d.ts" />
var PageCurl;
(function (PageCurl) {
    var Container = createjs.Container;
    var Rectangle = createjs.Rectangle;
    var Shape = createjs.Shape;
    class PokerCurl extends PageCurl.CalcCurl {
        constructor(lib_PokerCard) {
            super(300, 458);
            this.pokerContainer = new Container();
            this.clickAreasName = ["leftTop", "rightTop", "leftBottom", "rightBottom", "top", "Bottom", "left", "right"];
            this.debugLineSize = 5;
            this.offsetX = 0;
            this.offsetY = 0;
            this.initOriginPoints = () => {
                this.originPoints = [
                    new PageCurl.Vector2(0, 0),
                    new PageCurl.Vector2(this.width, 0),
                    new PageCurl.Vector2(0, this.height),
                    new PageCurl.Vector2(this.width, this.height)
                ];
            };
            this.initHitAresData = () => {
                let areaSize = 50;
                this.hitAreas = [
                    new Rectangle(0, 0, areaSize, areaSize),
                    new Rectangle(this.width, 0, -areaSize, areaSize),
                    new Rectangle(0, this.height, areaSize, -areaSize),
                    new Rectangle(this.width, this.height, -areaSize, -areaSize),
                    new Rectangle(areaSize, 0, this.width - areaSize * 2, areaSize),
                    new Rectangle(areaSize, this.height, this.width - areaSize * 2, -areaSize),
                    new Rectangle(0, areaSize, areaSize, this.height - areaSize * 2),
                    new Rectangle(this.width, areaSize, -areaSize, this.height - areaSize * 2) //右
                ];
            };
            this.initCardContainer = () => {
                this.pageContainer = this.pokerContainer;
                // this.pageContainer.rotation = 90;
            };
            this.initPokerBack = () => {
                this.pokerBack = new this.lib_PokerCard.PokerBack();
                this.pokerContainer.addChild(this.pokerBack);
            };
            this.initPoker = () => {
                this.poker = new this.lib_PokerCard.PokerCard();
                this.poker.gotoAndStop(10);
                this.poker.visible = false;
                this.pokerBack.addChild(this.poker);
                this.showPage = this.poker;
            };
            this.initPokerShadow = () => {
                this.pokerShadow = new Shape();
                this.pokerShadow.graphics
                    .beginLinearGradientFill(["#000000", "rgba(0, 0, 0, 0)"], [0, 1], 0, 40, 0, -40)
                    .drawRect(-this.width * 2, -40, this.width * 4, 40);
                this.pokerBack.addChild(this.pokerShadow);
                let pokerShadowMask = new Shape();
                pokerShadowMask.graphics.beginFill("#ff0000").drawRoundRect(0, 0, this.width, this.height, 30);
                this.pokerShadow.mask = pokerShadowMask;
            };
            this.initMask = () => {
                let mask = new Shape();
                mask.graphics.setStrokeStyle(this.debugLineSize)
                    .beginStroke("rgba(255,0,0,0.5)").beginFill("rgba(255,0,0,0.2)")
                    .drawRect(-this.width * 2, -this.height * 1.5, this.width * 4, this.height * 1.5);
                this.mask = mask;
            };
            this.initHitAres = () => {
                for (var i = 0; i < this.hitAreas.length; i++) {
                    var clickShape = new Shape();
                    var hitArea = this.createClickArea(this.hitAreas[i]);
                    clickShape.hitArea = hitArea;
                    clickShape.name = this.clickAreasName[i];
                    clickShape.addEventListener("mousedown", this.onMouseDownHandle);
                    clickShape.addEventListener("pressmove", this.onPressMoveHandle);
                    clickShape.addEventListener("pressup", this.onPressUpHandle);
                    this.pokerContainer.addChild(clickShape);
                }
            };
            this.createClickArea = (rect) => {
                let shape = new Shape();
                shape.graphics.beginFill("#FFFFFF").drawRect(rect.x, rect.y, rect.width, rect.height);
                shape.alpha = 0.1;
                return shape;
            };
            this.setOriginPoint = (clickAreaName, localPoint) => {
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
            };
            this.onMouseDownHandle = (evt) => {
                let localPoints = this.pokerBack.globalToLocal(evt.stageX, evt.stageY);
                let localPointsV2 = new PageCurl.Vector2(localPoints.x, localPoints.y);
                this.poker.gotoAndStop(Math.floor((Math.random() * 12)));
                this.pokerBack.mask = this.mask;
                this.pokerShadow.visible = true;
                this.poker.visible = true;
                this.setOriginPoint(evt.target.name, localPointsV2);
                this.startClick(localPointsV2);
                this.updatePokerShadow();
            };
            this.onPressMoveHandle = (evt) => {
                let localPoints = this.pokerBack.globalToLocal(evt.stageX, evt.stageY);
                this.offsetX = localPoints.x - this.startPoint.x;
                this.offsetY = localPoints.y - this.startPoint.y;
                this.daggle(new PageCurl.Vector2(this.startPoint.x + this.offsetX, this.startPoint.y + this.offsetY));
                this.updatePokerShadow();
            };
            this.onPressUpHandle = (evt) => {
                this.pokerBack.mask = null;
                this.poker.visible = false;
                this.pokerShadow.visible = false;
                this.offsetX = this.offsetY = 0;
            };
            this.updatePokerShadow = () => {
                this.pokerShadow.x = this.mask.x;
                this.pokerShadow.y = this.mask.y;
                this.pokerShadow.rotation = this.mask.rotation;
                this.pokerShadow.mask.x = this.poker.x;
                this.pokerShadow.mask.y = this.poker.y;
                this.pokerShadow.mask.rotation = this.poker.rotation;
                this.pokerShadow.mask.regX = this.poker.regX;
                this.pokerShadow.mask.regY = this.poker.regY;
            };
            this.getView = () => {
                return this.pokerContainer;
            };
            this.lib_PokerCard = lib_PokerCard;
            this.initOriginPoints();
            this.initHitAresData();
            this.initCardContainer();
            this.initPokerBack();
            this.initPoker();
            this.initPokerShadow();
            this.initMask();
            this.initHitAres();
        }
    }
    PageCurl.PokerCurl = PokerCurl;
})(PageCurl || (PageCurl = {}));
/// <reference path="createjs/easeljs.d.ts" />
var PageCurl;
(function (PageCurl) {
    class main {
        constructor(stage, lib_PokerCard) {
            let pokerCurl = new PageCurl.PokerCurl(lib_PokerCard);
            let pokerView = pokerCurl.getView();
            pokerView.x = 220;
            pokerView.y = 150;
            pokerView.scale = 0.8;
            stage.addChild(pokerView);
            let pokerCurl2 = new PageCurl.PokerCurl(lib_PokerCard);
            let pokerView2 = pokerCurl2.getView();
            pokerView2.x = 520;
            pokerView2.y = 650;
            pokerView2.rotation = 90;
            pokerView2.scale = 0.8;
            stage.addChild(pokerView2);
        }
    }
    PageCurl.main = main;
})(PageCurl || (PageCurl = {}));
