(() => {
    interface IPersion{
        first:string
        last:string
    }

    class Persion{
        first:string
        last:string
        full:string

        constructor (first:string,last:string){
            this.first = first
            this.last = last
            this.full = this.first + this.last
        }
    }

    const persion = new Persion('诸葛','Kongming')

    function showName(per:Persion){
        return per.full
    }

    console.log(showName(persion))


})()