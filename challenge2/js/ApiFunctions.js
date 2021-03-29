export async function fetchAPI(url) {
    return await fetch(url)
    .then(r=>{if(!r.ok) throw Error(r.statusText); return r;})
    .then(r=>r.json())
    .catch((error) => {
        console.error('Error:', error);
        return false;
      });
  }