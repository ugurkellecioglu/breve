export const SaveUrl = async (data) => {
  return new Promise((resolve, reject) => {
    fetch('/api/helloworld', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res)
    .then(async (res) => {
      const json = await res.json();
      if(res.status === 200) {
       resolve(json);
      }
      reject(new Error(res.statusText));
    }
    )
    .catch(error => reject(error));
  }
  );



}

