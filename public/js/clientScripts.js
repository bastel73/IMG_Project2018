if ("serviceWorker" in navigator) {
  try {
    navigator.serviceWorker.register("sw.js");
    console.log("SW registered");
  } catch (error) {
    console.log("Registration of SW failed");
  }
}
fetch("/getData")
  .then(res => {
    if (res.ok === false) {
      console.log("OOps...");
      return Promise.reject();
    }
    return res.json();
  })
  .then(result => {
      result.forEach(player=>{
          console.log(player);
      })
    let idbFactory = window.indexedDB;
let request = idbFactory.open("TestDatabase", 9);

request.onerror = event => {
  let error = event.target.error;
  console.error(error.message);
};
request.onsuccess = event => {
  let database = event.target.result;
  let transaction = database.transaction(["Player"], "readwrite");
  let objectStore = transaction.objectStore("Player");
  result.forEach(player => {
    objectStore.add(player);
  });
};
request.onupgradeneeded = event => {
  let database = event.target.result;
  let objectStore = database.createObjectStore("Player", {
    keyPath: "playerID"
  });
};
  })
  .catch(err=>{
      console.error(error);
  })


