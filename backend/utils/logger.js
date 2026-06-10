function serializeError(error) {
  const source = error?.original || error?.parent || error;

  return {
    name: error?.name,
    message: error?.message,
    code: source?.code,
    detail: source?.detail,
    stack: error?.stack,
  };
}

function logError(scope, error) {
  console.error(`[${new Date().toISOString()}] ${scope}`, serializeError(error));
}

module.exports = {
  logError,
};
