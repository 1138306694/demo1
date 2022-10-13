(function () {
    function showName(persion) {
        return persion.lastName + '_' + persion.firstName;
    }
    var per = {
        firstName: '和',
        lastName: '哈哈'
    };
    console.log(showName(per));
})();
