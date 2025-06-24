async function fetchData() {
  try {
    const data = await getDataFromServer();
    console.log(`Data: ${data}`);

    if (data == null) {
      alert("No data found");
      alert("Check your connection");
    }
  } catch (error) {
    alert("Failed to retrieve data");
    console.error("Error fetching data:", error);
  }
}