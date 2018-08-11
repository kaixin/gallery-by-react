import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

//获取图片相关的数据
var imageDatas = require('./data/imageDatas.json');

//利用自执行函数，将图片信息转成URL路径信息
imageDatas = (function genImageURL(imageDataArr) {
    for (var i = 0; i < imageDataArr.length; i++) {
        var singleImageData = imageDataArr[i];
        singleImageData.imageURL = require('./data/images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }

    return imageDataArr;
})(imageDatas);

/**
 * 获取区间内的一个随机值
 * @param {*} low 
 * @param {*} high 
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 获取-30° 到 30°范围内的旋转值
 */
function get30DegRandom() {
    return Math.random() * 60 - 30;
}

class ImgFigure extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        if(this.props.arrange.isCenter) {
            this.props.inverse();
        }else {
            this.props.center();
        }
        

        e.stopPropagation();
        e.preventDefault();
    }
    
    render() {
        var styleObj = {};

        if (this.props.arrange.pos) {
            styleObj = Object.assign({}, this.props.arrange.pos);
        }

        var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

        //旋转的css写法： transform: rotate(30deg)
        //这里厂商前缀的写法要用WebkitRansform/Moz/Ms代替-webkit-/-moz-/-ms-
        if (this.props.arrange.rotate) {
            //给transform属性加浏览器厂商前缀
            ['Webkit', 'Moz', 'ms', ''].forEach(function (value, index) {
                if (value) {
                    styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
                } else {
                    styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
                }
            }.bind(this));
        }

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                    <img src={this.props.data.imageURL}
                        alt={this.props.data.title}
                    />
                    <figcaption>
                        <h2 className="img-title">{this.props.data.title}</h2>
                        <div className = 'img-back' onClick={this.handleClick} >
                            <p>
                                {this.props.data.desc}
                            </p>
                        </div>
                    </figcaption>
            </figure>
        )
    }
}

class ControllerUnits extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(e) {
        //如果点击的是当前正在选中态的按钮，则翻转图片，否则居中图片
        if(this.props.arrange.isCenter) {
            this.props.inverse();
        }else {
            this.props.center();
        }

        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        var controllerUnitClassName = "controller-unit";

        //如果对应的是居中的图片，显示控制按钮的居中态
        if(this.props.arrange.isCenter) {
            controllerUnitClassName += " is-center";

            //如果对应的是翻转的图片，显示控制按钮的翻转态
            if(this.props.arrange.isInverse) {
                controllerUnitClassName += " is-inverse";
            }
        }

        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
}

class App extends Component {
    constructor() {
        super();
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: { //水平方向取值范围
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: { //垂直方向取值范围
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state = {
            imgsArrangeArr: [
                // {
                //   pos: {
                //     left: 0,
                //     top: 0
                //   },
                //   rotate: 0, //图片的旋转信息
                //   isInverse: false, //设置翻转信息
                //   isCenter: false,
                // }
            ]
        };
    }

    rearrange(centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr;
        var Constant = this.Constant;
        var centerPos = Constant.centerPos;
        var hPosRange = Constant.hPosRange;
        var vPosRange = Constant.vPosRange;
        var hPosRangeLeftSecX = hPosRange.leftSecX;
        var hPosRangeRightSecX = hPosRange.rightSecX;
        var hPosRangeY = hPosRange.y;
        var vPosRangeTopY = vPosRange.topY;
        var vPosRangeX = vPosRange.x;

        var imgsArrangeTopArr = [];
        var topImgNum = Math.floor(Math.random() * 2); //取0或1个图片放在上方区域
        var topImgSpliceIndex = 0;

        //首先居中centerIndex的图片
        var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isInverse: false,
            isCenter: true,
        }

        //取出要布局的上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
                },
                rotate: get30DegRandom(),
                isInverse: false,
                isCenter: false,
            }
        });

        //布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            //前半部分布局左边，右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isInverse: false,
                isCenter: false,
            }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });

    }

    inverse(index) {
        return function() {
            var imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this)
    }

    /**
     * 居中某个index的图片
     * @param {*} index 
     */
    center(index) {
        return function() {
            this.rearrange(index);
        }.bind(this);
    }

    //组件加载以后，为每张图片计算器位置的范围
    componentDidMount() {
        //首先拿到舞台的大小
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //拿到一个imageFigure的大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        //计算左侧右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = 0 - halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = 0 - halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //计算上册图片排布位置的取值范围
        this.Constant.vPosRange.topY[0] = 0 - halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }

    render() {
        var controllerUnits = [];
        var imgFigures = [];

        imageDatas.forEach(function (value, index) {

            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false,
                }
            }

            imgFigures.push(<ImgFigure key={index} data={value} 
                ref={"imgFigure" + index} arrange={this.state.imgsArrangeArr[index]}
                inverse={this.inverse(index)}
                center={this.center(index)} />);
            controllerUnits.push(<ControllerUnits 
                key={index}
                arrange={this.state.imgsArrangeArr[index]}
                inverse={this.inverse(index)}
                center={this.center(index)} />);
        }.bind(this));

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

export default App;
