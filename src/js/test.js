class UiDate {
    a = '';
    b = '';
    doms = {};
    constructor() {
        console.log('构造');
        this.a = 'aaa'
        this.getA();
        this.doms.good = document.querySelector('.goods-list');
        
        this.createHtml();
        try{
            console.log(this);
        }catch( e){
            console.log(e);
        }
    }
    createHtml(){
        console.log(this.doms.good.innerHTML = '<span>aaa</span>');
    }
    getA() {
        console.log('getA');
        return this.a;
    }
    setA() {
        this.a = 'bbb';
    }
}
class Goods {
    constructor(g){
        g = {... g}
        console.log(g,'===')
    }
}
let ui = new UiDate();
let good = new Goods(this.alert);
// ui.setA();
console.log(this,'this')
