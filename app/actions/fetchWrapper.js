//wrapper for adding a timeout option to the promise returned by fetch()
export default function fetchWrapper(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("Timeout van verbinding met de server"));
    }, ms);
    promise.then(resolve, reject);
  });
}
