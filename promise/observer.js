
// 观察者
class Subject{
    constructor(name) {
        this.name = name;
        this.state = '开心的'; //初始化状态
        this.observers = [];
    }
    // 添加观察者
    attach(o){
        this.observers.push(o);
    }
    setState(newState){
        this.state = newState;
        //通知观察者
        this.observers.forEach(o=>o.update(this));
    }
}
class Observer{
    constructor(name) {
        this.name = name;
    }
    update(baby){
        console.log('当前'+ this.name + '被通知了','当前小宝宝的状态是:'+ baby.state);
    }
}

const baby = new Subject('宝宝');
const father = new Observer('爸爸');
const mother = new Observer('妈妈');
baby.attach(father);
baby.attach(mother);
baby.setState('被欺负了');