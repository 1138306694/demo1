(() => {
    interface Persion{
        firstName:string
        lastName:string
    }

    function showName(persion:Persion){
        return persion.lastName + '_' + persion.firstName
    }

    const per = {
        firstName:'和',
        lastName: '哈哈'
    }
    console.log(showName(per))
})()