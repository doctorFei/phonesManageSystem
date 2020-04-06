const queryUrl = (str,ignore) => {
  var t = '',
    reg = ignore ? 'gi' : 'g';
  decodeURIComponent(window.location.search).toString().replace(
    new RegExp(
      "[?&]" +
      str + "=[^&]+", reg),
    function (r) {
      var n = r.split("=")[1];
      n && (t = n);
    });
  return t;
}
export default {
  queryUrl
}
