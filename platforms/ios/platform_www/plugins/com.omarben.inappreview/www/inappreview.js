cordova.define("com.omarben.inappreview.inappreview", function(require, exports, module) {
/*global cordova, module*/

module.exports = {
    requestReview: function (successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Review", "requestReview");
    }
};

});
