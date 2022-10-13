(function () {
    var Persion = /** @class */ (function () {
        function Persion(first, last) {
            this.first = first;
            this.last = last;
            this.full = this.first + this.last;
        }
        return Persion;
    }());
    var persion = new Persion('诸葛', 'Kongming');
    function showName(per) {
        return per.full;
    }
    console.log(showName(persion));
})();
