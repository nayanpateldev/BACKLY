const logs = (message, type="INFO") => {
  console.log(`${new Date().toISOString()} - ${type} - ${message}`);
}

export default logs;