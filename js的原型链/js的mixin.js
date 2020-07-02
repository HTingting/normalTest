function mixin(sourceObj,targetObj){
    for(var key in sourceObj){
        //只会在不存在的情况下复制
        if(!(key in targetObj)){
            targetObj[key] = sourceObj[key];
        }
    }
    return targetObj;
}

var Vehicle = {
    engines: 1,
    igntion: function(){
        console.log("Turning on my enginx");
    },
    drive: function(){
        this.igntion();
        console.log('Steering and moving forward');
    }
}

var Car = mixin(Vehicle,{
    wheel:4,
    drive: function(){
        Vehicle.drive.call(this); //显示调用，使用call来确保drive在car对象的上下文中执行
        console.log('Rolling on all' + this.wheels + 'wheels');
    }
});


//传统的javascript类Vehicle
function Vehicle(){
    this.engines = 1;
}
Vehicle.prototype.ignition = function(){
    console.log("Turning on my engine");
}
Vehicle.prototype.drive = function(){
    this.ignition();
    console.log('Steering and moving forward!');
}

//寄生类 Car
function Car(){
    //首先，car是一个Vehicle
    var car = new Vehicle();

    //接着，我们对Car进行定制
    car.wheels = 4;

    //保存到Vehicle::drive()的特殊引用
    var vehDrive = car.dirve;

    //重写Vehicle::drive();
    car.drive = function(){
        vehDrive.call(this);
        console.log('Rolling on all' + this.wheels + 'wheels');
    }
    return car;
}

var myCar = new Car();

myCar.drive();



//继承的方式来实现
function Foo(who){
    this.me = who;
}
Foo.prototype.identify = function(){
    return "I am" + this.me;
}

function Bar(who){
    Foo.call(this,who);
}
Bar.prototype = Object.create(Foo.prototype);

Bar.prototype.speak = function(){
    alert("Hello" + this.identify() + '.');
}

var b1 = new Bar('b1');
var b2 = new Bar("b2");

b1.speak();
b2.speak();


//对象关联风格
Foo = {
    init:function(who){
        this.me = who;
    },
    identify:function(){
        return "I am" + this.me;
    }
};
Bar = Object.create(Foo);

Bar.speak = function(){
    alert("Hello"+this.identify()+'.');
}

var b1 = Object.create(Bar);
b1.init("b1");
var b2 = Object.create(Bar);
b2.init("b2");






































