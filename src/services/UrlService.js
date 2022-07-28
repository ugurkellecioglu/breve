export const SaveUrl = (data) => {
  const historicalUrls = JSON.parse(localStorage.getItem('historicalUrls')) || [];
    return new Promise((resolve, reject) => {
       setTimeout(() => {
        localStorage.setItem(
            "historicalUrls",
            JSON.stringify([...historicalUrls, data])
          )
            resolve(data)
       }, 2000);
    });
}

